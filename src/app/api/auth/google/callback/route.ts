import { googleOAuthClient } from "@/lib/googleOAuth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prismadb from "@/lib/db";
import { redirect } from "@/i18n/routing";
import { AccountType } from "@prisma/client";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/sessions";
import { getLocale } from "next-intl/server";
import { getVerificationLink } from "@/server/actions/verification.actions";
import { sendVerificationEmail } from "@/server/actions/email.actions";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const locale = await getLocale();
  if (!code || !state) {
    console.error("No code or state");
    return new Response("Invalid Request", { status: 400 });
  }

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get("codeVerifier")?.value;
  const savedState = cookieStore.get("state")?.value;
  const savedRole = cookieStore.get("role")?.value;
  const savedReturnUrl = cookieStore.get("returnUrl")?.value || "/";
  if (!codeVerifier || !savedState) {
    console.error("No code verifier or state");
    return new Response("Invalid Request", { status: 400 });
  }
  if (state !== savedState) {
    console.error("state mismatch");
    return new Response("Invalid Request", { status: 400 });
  }

  const { accessToken } = await googleOAuthClient.validateAuthorizationCode(
    code,
    codeVerifier,
  );

  const googleResponse = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const googleData = (await googleResponse.json()) as {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  let accountId: number;
  let accountUuid: string;

  // if the email exists in our record we can create a cookie for them and sign the in
  // if the email doesn't exist we create a new user, then create a cookie to sign them in

  const existingUser = await prismadb.account.findUnique({
    where: {
      email: googleData.email,
    },
  });

  if (existingUser) {
    accountId = existingUser.id;
    accountUuid = existingUser.uuid;
  } else {
    const [firstName, lastName] = googleData.name.split(" ");
    const account = await prismadb.account.create({
      data: {
        role: savedRole as AccountType,
        email: googleData.email,
        emailVerified: new Date(),
      },
    });

    const verificationLink = await getVerificationLink(account.id);
    await sendVerificationEmail(googleData.email, verificationLink);

    if (savedRole === AccountType.USER) {
      await prismadb.user.create({
        data: {
          accountId: account.id,
          pictureUrl: googleData.picture,
          firstName,
          lastName,
          uuid: account.uuid,
          contactName: `${firstName} ${lastName}`,
          contactEmail: googleData.email,
          contactEmailVerified: new Date(),
        },
      });
      console.log("created user");
    }
    if (savedRole === AccountType.AGENCY) {
      await prismadb.agency.create({
        data: {
          accountId: account.id,
          uuid: account.uuid,
          ownerFirstName: firstName,
          ownerLastName: lastName,
          ownerEmail: googleData.email,
        },
      });
      console.log("created agency");
    }
    accountId = account.id;
    accountUuid = account.uuid;
  }

  const token = await generateSessionToken();
  const session = await createSession(token, accountId);
  await setSessionTokenCookie(token, session.expiresAt, accountUuid);

  if (existingUser) {
    if (existingUser.role === AccountType.USER) {
      redirect({
        href: savedReturnUrl,
        locale: locale,
      });
    }
    if (existingUser.role === AccountType.AGENCY) {
      const agency = await prismadb.agency.findUnique({
        where: {
          accountId: existingUser.id,
        },
      });
      const missingDetails = !agency?.name || !agency?.slug || !agency?.logo;
      const missingInfo =
        !agency?.ownerFirstName ||
        !agency?.ownerLastName ||
        !agency?.ownerEmail;

      let href;
      if (missingDetails) {
        href = "/agency/profile/details";
      } else if (missingInfo) {
        href = "/agency/profile/info";
      } else {
        href = savedReturnUrl;
      }
      console.log("redirecting to", href);

      redirect({
        href,
        locale: locale,
      });
    }
  } else {
    if (savedRole === AccountType.USER) {
      redirect({
        href: "/profile/info",
        locale: locale,
      });
    }
    if (savedRole === AccountType.AGENCY) {
      redirect({
        href: `/agency/profile/details`,
        locale: locale,
      });
    }
  }
}
