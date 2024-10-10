"use server";

import { validateRequest } from "@/lib/auth";
import prismadb from "@/lib/db";
import { capitalizeString } from "@/lib/utils";
import { error } from "console";
import { redirect } from "next/navigation";

function validPhoneNumber(phone: string) {
  return true;
}
export async function updateUserInfo(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) {
    return {
      success: false,
      error: "Unauthenticated",
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

  // update user info
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

  return {
    success: true,
    error: null,
  };
}
