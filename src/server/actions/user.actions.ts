"use server";

import { redirect } from "@/i18n/routing";
import { getUser, validateRequest } from "@/lib/auth";
import prismadb from "@/lib/db";
import { getCurrentSession, getCurrentUser } from "@/lib/sessions";
import { capitalizeString, validPhoneNumber } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getVerificationLink } from "./verification.actions";
import { sendVerificationEmail } from "./email.actions";

export async function updateUserInfo(formData: FormData) {
  const { user } = await getCurrentUser();
  const { account } = await getCurrentSession();
  if (!account) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  console.log("userFormData", formData);
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const phone = formData.get("phone");

  // validate the form data
  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof phone !== "string" ||
    !validPhoneNumber(phone)
  ) {
    return {
      success: false,
      error: "Invalid form data",
    };
  }

  if (user) {
    await prismadb.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: capitalizeString(firstName),
        lastName: capitalizeString(lastName),
        phone: phone,
      },
    });
  } else {
    const user = await prismadb.user.create({
      data: {
        uuid: account.uuid,
        accountId: account.id,
      },
    });
    // update user info
  }
  redirect({ href: "/profile/info", locale: "mk" });
}
