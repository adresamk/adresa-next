"use server";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { ActionResult } from "@/components/Form";
import prismadb from "@/lib/db";
import { Argon2id } from "oslo/password";
import { UserRoles } from "@/lib/data/user/importantData";
import { redirect } from "next/navigation";
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

import { generateCodeVerifier, generateState } from "arctic";
import { googleOAuthClient } from "@/lib/googleOAuth";

export async function signIn(
  prevState: any,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email")?.toString();

  if (!email || !emailRegex.test(email)) {
    return {
      error: "Invalid email",
      success: false,
    };
  }
  const password = formData.get("password");
  console.log("Existing user", email, password);

  if (typeof password !== "string") {
    return {
      error: "Invalid password",
      success: false,
    };
  }
  console.log("Existing user", email, password);

  const existingUser = await prismadb.user.findFirst({
    where: {
      email,
    },
  });

  console.log("Existing user", existingUser);
  if (!existingUser) {
    return {
      error: "User with that email doesn't exist",
      success: false,
    };
  }

  console.log("Existing user", existingUser);

  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword!,
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

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  cookieStore.set("auth-cookie-exists", existingUser.id, {
    ...sessionCookie.attributes,
    httpOnly: false,
  });

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

  if (!email || !emailRegex.test(email)) {
    return {
      error: "Invalid email",
      success: false,
    };
  }

  if (typeof password !== "string" || password.length !== 8) {
    return {
      error: "Invalid password, it must be 8 characters long",
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
    const existingUser = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        error: "An account with that email already exists",
        success: false,
      };
    }

    const hashedPassword = await new Argon2id().hash(password);

    const user = await prismadb.user.create({
      data: {
        role: UserRoles.USER,
        email,
        hashedPassword,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    const cookieStore = await cookies();
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    cookieStore.set("auth-cookie-exists", user.id, {
      ...sessionCookie.attributes,
      httpOnly: false,
    });
  } catch (error) {
    return {
      error: "Something went wrong",
      success: false,
    };
  }

  return redirect("/");
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
    const existingUser = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        error: "An account with that email already exists",
        success: false,
      };
    }

    const hashedPassword = await new Argon2id().hash(password);
    // create new agency for user
    const newAgency = await prismadb.agency.create({
      data: {},
    });

    const user = await prismadb.user.create({
      data: {
        role: UserRoles.AGENCY,
        email,
        hashedPassword,
        agencyId: newAgency.id,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    const cookieStore = await cookies();
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    cookieStore.set("auth-cookie-exists", user.id, {
      ...sessionCookie.attributes,
      httpOnly: false,
    });
  } catch (error) {
    console.error(error);
    return {
      error: "Something went wrong",
      success: false,
    };
  }

  return redirect("/agency/profile/details");
}

export async function logout() {
  const sessionCookie = await lucia.createBlankSessionCookie();
  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  cookieStore.set("auth-cookie-exists", "", {
    ...sessionCookie.attributes,
    httpOnly: false,
  });
  return { success: true };
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
