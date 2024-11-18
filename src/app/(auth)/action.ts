"use server";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateState } from "arctic";
import { googleOAuthClient } from "@/lib/googleOAuth";

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
