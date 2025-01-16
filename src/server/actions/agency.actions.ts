"use server";

import { redirect } from "@/i18n/routing";
import prismadb from "@/lib/db";
import { getCurrentSession, getCurrentUser } from "@/lib/sessions";
import { capitalizeString, validPhoneNumber } from "@/lib/utils";
import { getLocale } from "next-intl/server";

export async function updateAgencyDetails(formData: FormData) {
  const { isAuthenticated, agency } = await getCurrentUser();
  const { session, account } = await getCurrentSession();
  const locale = await getLocale();
  // This should never be called technically
  if (!account || !session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  console.log("userFormData", formData);
  const name = formData.get("name");
  const address = formData.get("address");
  const logo = formData.get("logo");

  const website = formData.get("website");
  const phone = formData.get("phone");
  const contactPersonFullName = formData.get("contactPersonFullName");
  const contactPersonEmail = formData.get("contactPersonEmail");
  const contactPersonPhone = formData.get("contactPersonPhone");
  const workHours = formData.get("workHours");
  const gpsLocation = formData.get("gpsLocation");
  const description = formData.get("description");
  const shortDescription = formData.get("shortDescription");
  const branding = formData.get("branding");
  const preferredContactMethod = formData.get("preferredContactMethod");
  const contactHours = formData.get("contactHours");

  // validate the form data
  if (
    typeof name !== "string" ||
    typeof address !== "string" ||
    typeof logo !== "string" ||
    typeof website !== "string" ||
    typeof phone !== "string" ||
    typeof workHours !== "string" ||
    typeof gpsLocation !== "string" ||
    typeof description !== "string" ||
    typeof shortDescription !== "string" ||
    typeof branding !== "string" ||
    typeof contactPersonFullName !== "string" ||
    typeof contactPersonEmail !== "string" ||
    typeof contactPersonPhone !== "string" ||
    typeof preferredContactMethod !== "string" ||
    typeof contactHours !== "string"
  ) {
    return {
      success: false,
      error: "Invalid form data",
    };
  }

  // on first time here, we need to check if the user has an agency
  // if not, they're just setting up their profile and we need to create an agency for them
  if (!agency) {
    // create an agency
    await prismadb.agency.create({
      data: {
        accountId: account.id,
        uuid: account.uuid,
        name,
        slug: name.toLowerCase().replace(" ", "-"),
        address,
        website,
        phone,
        logo,
        contactPersonFullName,
        contactPersonEmail,
        contactPersonPhone,
        workHours,
        gpsLocation,
        description,
        shortDescription,
        branding,
      },
    });
  }
  if (agency) {
    await prismadb.agency.update({
      where: {
        id: agency.id,
      },
      data: {
        name,
        slug: name.toLowerCase().replace(" ", "-"),
        address,
        logo,
        website,
        phone,
        contactPersonFullName,
        contactPersonEmail,
        contactPersonPhone,
        workHours,
        gpsLocation,
        description,
        shortDescription,
        branding,
      },
    });
  }
  redirect({ href: "/agency/profile/details", locale: locale });
}
export async function updateAgencyInfo(formData: FormData) {
  const { agency } = await getCurrentUser();
  const locale = await getLocale();
  if (!agency) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  console.log("userFormData", formData);
  const ownerFirstName = formData.get("ownerFirstName");
  const ownerLastName = formData.get("ownerLastName");
  const phone = formData.get("phone");
  const ownerEmail = formData.get("ownerEmail");
  // validate the form data
  if (
    typeof ownerFirstName !== "string" ||
    typeof ownerLastName !== "string" ||
    typeof phone !== "string" ||
    typeof ownerEmail !== "string" ||
    !validPhoneNumber(phone)
  ) {
    return {
      success: false,
      error: "Invalid form data",
    };
  }

  // update user info
  await prismadb.agency.update({
    where: {
      id: agency.id,
    },
    data: {
      ownerFirstName: capitalizeString(ownerFirstName),
      ownerLastName: capitalizeString(ownerLastName),
      phone: phone,
      ownerEmail: ownerEmail,
    },
  });
  redirect({ href: "/agency/profile/info", locale: locale });

  return {
    success: true,
    error: null,
  };
}
