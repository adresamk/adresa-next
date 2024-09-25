import { googleOAuthClient } from "@/lib/googleOAuth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prismadb from "@/lib/db";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRoles } from "@/global/data";

export async function GET(req: NextRequest, res: NextResponse) {
  console.log(req);
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    console.error("No code or state");
    return new Response("Invalid Request", { status: 400 });
  }

  const codeVerifier = cookies().get("codeVerifier")?.value;
  const savedState = cookies().get("state")?.value;

  if (!codeVerifier || !savedState) {
    console.error("No code verifier or state");
    return new Response("Invalid Request", { status: 400 });
  }
  if (state !== savedState) {
    console.error("state mismatch");
    return new Response("Invalid Request", { status: 400 });
  }

  const { accessToken } =
    await googleOAuthClient.validateAuthorizationCode(
      code,
      codeVerifier
    );

  const googleResponse = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const googleData = (await googleResponse.json()) as {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  let userId: string = "";

  // if the email exists in our record we can create a cookie for them and sign the in

  // if the email doesn't exist we create a new user, then create a cookie to sign them in

  const existingUser = await prismadb.user.findUnique({
    where: {
      email: googleData.email,
    },
  });

  if (existingUser) {
    userId = existingUser.id;
  } else {
    const [firstName, lastName] = googleData.name.split(" ");
    const user = await prismadb.user.create({
      data: {
        firstName,
        lastName,
        role: UserRoles.AGENCY,
        email: googleData.email,
        picture: googleData.picture,
      },
    });
    userId = user.id;
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  cookies().set("auth-cookie-exists", "", {
    ...sessionCookie.attributes,
    httpOnly: false,
  });

  redirect("/");
}
