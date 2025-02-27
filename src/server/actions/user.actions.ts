"use server";

import { redirect } from "@/i18n/routing";
import prismadb from "@/lib/db";
import { getCurrentUser } from "@/lib/sessions";
import { capitalizeString, validPhoneNumber } from "@/lib/utils";
import { getLocale } from "next-intl/server";

export async function updateUserInfo(formData: FormData) {
  const { user, account } = await getCurrentUser();
  const locale = await getLocale();
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
  }
  // update user info

  redirect({
    href: "/profile/info",
    locale: locale,
  });
}

export async function updateUserContactInfo(formData: FormData) {
  // console.log("updateUserContactInfo", formData);

  const { user, account } = await getCurrentUser();
  const locale = await getLocale();
  if (!account) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  console.log("userFormData", formData);
  const contactName = formData.get("contactName");
  const contactPhone = formData.get("contactPhone");
  const contactEmail = formData.get("contactEmail");
  const contactHours = formData.get("contactHours");
  const preferredContactMethod = formData.get("preferredContactMethod");

  // validate the form data
  if (
    typeof contactName !== "string" ||
    typeof contactPhone !== "string" ||
    typeof contactEmail !== "string" ||
    typeof contactHours !== "string" ||
    typeof preferredContactMethod !== "string"
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
        contactName: contactName,
        contactPhone: contactPhone,
        contactEmail: contactEmail,
        contactHours: contactHours,
        preferredContactMethod: preferredContactMethod,
      },
    });
  }
  // update user info

  redirect({ href: "/profile/contact", locale: locale });
}
