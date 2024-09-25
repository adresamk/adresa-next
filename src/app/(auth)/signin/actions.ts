import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ActionResult } from "@/components/Form";
import prismadb from "@/lib/db";
import { Argon2id } from "oslo/password";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export async function signIn(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  "use server";
  const email = formData.get("email")?.toString();

  if (!email || !emailRegex.test(email)) {
    return {
      error: "Invalid email",
      success: false,
    };
  }
  const password = formData.get("password");
  console.log("Existing user", email, password);

  if (typeof password !== "string" || password.length !== 8) {
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
    password
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
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  cookies().set("auth-cookie-exists", "", {
    ...sessionCookie.attributes,
    httpOnly: false,
  });

  const redirectPath = formData.get("redirect")?.toString();
  if (typeof redirectPath === "string") {
    redirect(redirectPath);
  }
  return redirect("/");
}
