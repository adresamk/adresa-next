import { ActionResult } from "@/components/Form";
import { UserRoles } from "@/global/data";
import { lucia } from "@/lib/auth";
import prismadb from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export async function signUp(
  _: any,
  formData: FormData
): Promise<ActionResult> {
  "use server";

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData
    .get("confirm-password")
    ?.toString();

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

  if (
    typeof confirmPassword !== "string" ||
    confirmPassword !== password
  ) {
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
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    cookies().set("auth-cookie-exists", user.id, {
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
