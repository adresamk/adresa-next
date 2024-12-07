"use server";
import { cookies } from "next/headers";
import { ActionResult } from "@/components/Form";
import prismadb from "@/lib/db";
import { Argon2id } from "oslo/password";
import { redirect } from "@/i18n/routing";
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

import { generateCodeVerifier, generateState } from "arctic";
import { googleOAuthClient } from "@/lib/googleOAuth";
import { getVerificationLink, sendVerificationEmail } from "./user.actions";
import { AccountType } from "@prisma/client";
import {
  createSession,
  generateSessionToken,
  getCurrentSession,
  deleteSessionTokenCookie,
  setSessionTokenCookie,
  invalidateSession,
} from "@/lib/sessions";
import { NextResponse } from "next/server";

export async function signIn(
  prevState: any,
  formData: FormData,
): Promise<ActionResult> {
  // this should be done in middleware and the cookies to be attached there
  const { session: existingSession } = await getCurrentSession();
  if (existingSession) {
    console.log("session, already logged in", existingSession);
    // redirect("/");
    return {
      error: "You are already logged in",
      success: false,
    };
  }

  // validations
  const email = formData.get("email")?.toString();

  if (!email || !emailRegex.test(email)) {
    return {
      error: "Invalid email",
      success: false,
    };
  }
  const password = formData.get("password");
  console.log("Sent email and password", email, password);

  if (typeof password !== "string") {
    return {
      error: "Invalid password",
      success: false,
    };
  }

  const existingAccount = await prismadb.account.findFirst({
    where: {
      email,
    },
  });

  console.log("Existing account", existingAccount);
  if (!existingAccount) {
    return {
      error: "Account with that email doesn't exist",
      success: false,
    };
  }

  const token = await generateSessionToken();
  const session = await createSession(token, existingAccount.id);
  await setSessionTokenCookie(token, session.expiresAt, existingAccount.uuid);

  const validPassword = await new Argon2id().verify(
    existingAccount.hashedPassword!,
    password,
  );

  if (!validPassword) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling, 2FA, etc.
    // If usernames are public, you can outright tell the user that the username is invalid.
    return {
      error: "Incorrect username or password",
      success: false,
    };
  }

  return {
    success: true,
    error: null,
  };
}

export async function signUpAsUser(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm-password")?.toString();
  // validations, in if statement to make it easier to read so i can fold
  if (true) {
    if (!email || !emailRegex.test(email)) {
      return {
        error: "Invalid email",
        success: false,
      };
    }

    if (typeof password !== "string" || password.length < 5) {
      return {
        error: "Invalid password, it must be more than 5 characters long",
        success: false,
      };
    }

    if (typeof confirmPassword !== "string" || confirmPassword !== password) {
      return {
        error: "Make sure confirm password matches password",
        success: false,
      };
    }
  }

  try {
    const existingAccount = await prismadb.account.findUnique({
      where: {
        email,
      },
    });

    if (existingAccount) {
      return {
        error: "An account with that email already exists",
        success: false,
      };
    }

    const hashedPassword = await new Argon2id().hash(password);

    const account = await prismadb.account.create({
      data: {
        role: AccountType.USER,
        email,
        hashedPassword,
      },
    });

    const user = await prismadb.user.create({
      data: {
        uuid: account.uuid,
        accountId: account.id,
      },
    });

    const verificationLink = await getVerificationLink(user.id);
    // console.log("verificationLink", verificationLink);
    await sendVerificationEmail(email, verificationLink);
    // console.log("Verification email sent successfully 2");

    const token = await generateSessionToken();
    const session = await createSession(token, account.id);

    await setSessionTokenCookie(token, session.expiresAt, account.uuid);
    //
    console.log("Verification email sent successfully 3");
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("error", error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }

  return redirect({
    href: "/",
    locale: "mk",
  });
}

export async function signUpAsAgency(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm-password")?.toString();

  if (!email || !emailRegex.test(email)) {
    return {
      error: "Invalid email",
      success: false,
    };
  }

  if (typeof password !== "string") {
    return {
      error: "Invalid password",
      success: false,
    };
  }

  if (typeof confirmPassword !== "string" || confirmPassword !== password) {
    return {
      error: "Make sure confirm password matches password",
      success: false,
    };
  }

  try {
    const existingAccount = await prismadb.account.findUnique({
      where: {
        email,
      },
    });

    if (existingAccount) {
      return {
        error: "An account with that email already exists",
        success: false,
      };
    }

    const hashedPassword = await new Argon2id().hash(password);
    // create new agency for user

    const account = await prismadb.account.create({
      data: {
        role: AccountType.AGENCY,
        email,
        hashedPassword,
      },
    });

    // const agency = await prismadb.agency.create({
    //   data: {
    //     uuid: account.uuid,
    //     accountId: account.id,
    //   },
    // });

    const token = await generateSessionToken();
    const session = await createSession(token, account.id);

    await setSessionTokenCookie(token, session.expiresAt, account.uuid);

    // return redirect("/agency/profile/details");
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

export async function logout() {
  const { session } = await getCurrentSession();

  if (!session) {
    return redirect({
      href: "/",
      locale: "mk",
    });
  }

  await invalidateSession(session.id);
  await deleteSessionTokenCookie();

  redirect({
    href: "/",
    locale: "mk",
  });
  // return { success: true };
}

export async function getGoogleOAuthConsentURL() {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const cookieStore = await cookies();
    cookieStore.set("codeVerifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    cookieStore.set("state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    const authUrl = await googleOAuthClient.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"],
      },
    );

    return { success: true, url: authUrl.toString() };
  } catch (error) {
    return {
      success: false,
      error: "Something went wrong during the google sso::" + error,
    };
  }
}
