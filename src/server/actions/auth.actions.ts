"use server";
import { cookies } from "next/headers";
import { ActionResult } from "@/components/Form";
import prismadb from "@/lib/db";
import { Argon2id } from "oslo/password";
import { redirect } from "@/i18n/routing";
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

import { generateCodeVerifier, generateState } from "arctic";
import { googleOAuthClient } from "@/lib/googleOAuth";
import { AccountType } from "@prisma/client";
import {
  createSession,
  generateSessionToken,
  getCurrentSession,
  deleteSessionTokenCookie,
  setSessionTokenCookie,
  invalidateSession,
} from "@/lib/sessions";

import { getVerificationLink } from "./verification.actions";
import { sendResetPasswordEmail, sendVerificationEmail } from "./email.actions";
import { capitalizeString, generateUniqueToken } from "@/lib/utils";
import { getLocale } from "next-intl/server";

export async function signIn(
  prevState: any,
  formData: FormData,
): Promise<ActionResult> {
  // this should be done in middleware and the cookies to be attached there
  const { session: existingSession } = await getCurrentSession();

  console.log("existingSession", existingSession);
  if (existingSession) {
    // console.log("session, already logged in", existingSession);
    // redirect("/");
    return {
      error: "alreadyLoggedIn",
      success: false,
    };
  }

  // validations
  const email = formData.get("email")?.toString();

  if (!email || !emailRegex.test(email)) {
    return {
      error: "invalidEmail",
      success: false,
    };
  }
  const password = formData.get("password");

  if (typeof password !== "string") {
    return {
      error: "invalidPassword",
      success: false,
    };
  }

  const existingAccount = await prismadb.account.findFirst({
    where: {
      email,
    },
    include: {
      user: true,
      agency: true,
    },
  });

  if (!existingAccount) {
    return {
      error: "accountDoesNotExist",
      success: false,
    };
  }

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
      error: "incorrectEmailOrPassword",
      success: false,
    };
  }

  const token = await generateSessionToken();
  const session = await createSession(token, existingAccount.id);
  console.log("token from auth actions", token);
  await setSessionTokenCookie(token, session.expiresAt, existingAccount.uuid);

  return {
    success: true,
    error: null,
    data: {
      account: existingAccount,
      user: existingAccount.user,
      agency: existingAccount.agency,
    },
  };
}

export async function signUpAsUser(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm-password")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const phone = formData.get("phone")?.toString();

  console.log({
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phone,
  });
  // validations, in if statement to make it easier to read so i can fold
  if (true) {
    if (!email || !emailRegex.test(email)) {
      return {
        error: "invalidEmail",
        success: false,
      };
    }

    if (typeof password !== "string" || password.length < 5) {
      return {
        error: "badPasswordFormatting",
        success: false,
      };
    }

    if (typeof confirmPassword !== "string" || confirmPassword !== password) {
      return {
        error: "confirmPasswordDoesNotMatchPassword",
        success: false,
      };
    }

    if (typeof firstName !== "string" || typeof lastName !== "string") {
      return {
        error: "firstNameAndLastNameAreRequired",
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
        error: "accountAlreadyExists",
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
        firstName: capitalizeString(firstName),
        lastName: capitalizeString(lastName),
        phone: phone,
      },
    });
    const locale = await getLocale();
    const verificationLink = await getVerificationLink(account.id);
    // console.log("verificationLink", verificationLink);
    await sendVerificationEmail(email, verificationLink, locale);
    // console.log("Verification email sent successfully 2");

    const token = await generateSessionToken();
    const session = await createSession(token, account.id);

    await setSessionTokenCookie(token, session.expiresAt, account.uuid);
    //
    console.log("Verification email sent successfully 3");

    return {
      success: true,
      error: null,
      data: {
        account: account,
        isAuthenticated: true,
        user: user,
      },
    };
  } catch (error) {
    console.error("error", error);
    return {
      success: false,
      error: "somethingWentWrong",
    };
  }
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
      error: "invalidEmail",
      success: false,
    };
  }

  if (typeof password !== "string") {
    return {
      error: "invalidPassword",
      success: false,
    };
  }

  if (typeof confirmPassword !== "string" || confirmPassword !== password) {
    return {
      error: "confirmPasswordDoesNotMatchPassword",
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
        error: "accountAlreadyExists",
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
      error: "somethingWentWrong",
    };
  }
}

export async function logout() {
  // const response = await fetch(process.env.NEXT_PUBLIC_URL + "/api/logout", {
  //   method: "POST",
  // });
  // if (response.ok) {
  //   console.log("Logged out successfully!");
  // }
  const { session } = await getCurrentSession();
  const locale = await getLocale();
  console.log("session from authsessions logout", session);
  if (!session) {
    console.log("redirecting to home because no session");
    return redirect({
      href: "/",
      locale: locale,
    });
  }
  console.log("logout 1");
  try {
    await invalidateSession(session.id);
  } catch (error) {
    console.error("error invalidating session", error);
  }
  console.log("logout 2");

  try {
    await deleteSessionTokenCookie();
  } catch (error) {
    console.error("error deleting session token cookie", error);
  }
  console.log("logout 3");

  // redirect({
  //   href: "/",
  //   locale: "mk",
  // });
  return { success: true };
}

export async function getGoogleOAuthConsentURL(
  role: AccountType,
  returnUrl: string,
) {
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
    cookieStore.set("role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    cookieStore.set("returnUrl", returnUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    const authUrl = await googleOAuthClient.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile", "openid"],
      },
    );

    // console.log("authUrl", authUrl);
    return { success: true, url: authUrl.toString() };
  } catch (error) {
    return {
      success: false,
      error: "Something went wrong during the google sso::" + error,
    };
  }
}

export async function forgotPasswordRequest(
  prevState: ActionResult,
  formData: FormData,
) {
  const email = formData.get("email")?.toString();

  // always return success true to minimize timing attacks
  if (!email || !emailRegex.test(email)) {
    return {
      // error: "Invalid email",
      error: null,
      success: true,
    };
  }

  const account = await prismadb.account.findUnique({
    where: {
      email,
    },
  });

  if (!account) {
    console.log(
      "Somebody requested a reset password link for an account that doesn't exist",
    );
    return {
      // error: "Account with that email doesn't exist",
      error: null,
      success: true,
    };
  }

  const resetPasswordLink = await getResetPasswordLink(account.id);
  if (resetPasswordLink) {
    await sendResetPasswordEmail(account.email, resetPasswordLink);
  }

  return {
    success: true,
    error: null,
  };
}

export async function getResetPasswordLink(accountId: number) {
  const token = generateUniqueToken(); // Function to generate a unique token
  const expiresAt = new Date(Date.now() + 900000); // 15 minutes

  // Create the verification link in the database
  try {
    await prismadb.resetPasswordLink.create({
      data: {
        accountId,
        token,
        expiresAt,
      },
    });
    return `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;
  } catch (error) {
    console.error("Reset password link creation", error);
  }
}

export async function checkResetPasswordTokenValidity(token: string) {
  if (!token) {
    return {
      success: false,
      error: "invalidToken",
    };
  }

  const resetPasswordLink = await prismadb.resetPasswordLink.findUnique({
    where: {
      token,
    },
  });

  if (!resetPasswordLink) {
    return {
      success: false,
      error: "invalidToken",
    };
  }
  if (resetPasswordLink.expiresAt < new Date()) {
    return {
      success: false,
      error: "tokenExpired",
    };
  }

  return {
    success: true,
    error: null,
  };
}

export async function resetPassword(
  prevState: ActionResult,
  formData: FormData,
) {
  const newPassword = formData.get("newPassword")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const token = formData.get("token")?.toString();

  if (!newPassword || !confirmPassword || !token) {
    return {
      success: false,
      error: "passwordsAndTokenAreRequired",
    };
  }
  if (newPassword !== confirmPassword) {
    return {
      success: false,
      error: "passwordsDoNotMatch",
    };
  }

  const tokenLink = await prismadb.resetPasswordLink.findUnique({
    where: {
      token,
    },
    include: {
      account: true,
    },
  });

  //update password for account
  const hashedPassword = await new Argon2id().hash(newPassword);
  await prismadb.account.update({
    where: {
      id: tokenLink?.accountId,
    },
    data: {
      hashedPassword,
    },
  });

  return {
    success: true,
    error: null,
  };
}
