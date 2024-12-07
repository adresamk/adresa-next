"use server";

import { redirect } from "@/i18n/routing";
import { getUser, validateRequest } from "@/lib/auth";
import prismadb from "@/lib/db";
import { getCurrentSession, getCurrentUser } from "@/lib/sessions";
import { capitalizeString } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function updateAgencyDetails(formData: FormData) {
  const { isAuthorized, agency } = await getCurrentUser();
  const { session, account } = await getCurrentSession();

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
  const logoUrl = formData.get("logoUrl");

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

  // validate the form data
  if (
    typeof name !== "string" ||
    typeof address !== "string" ||
    typeof logoUrl !== "string" ||
    typeof website !== "string" ||
    typeof phone !== "string" ||
    typeof contactPersonFullName !== "string" ||
    typeof contactPersonEmail !== "string" ||
    typeof contactPersonPhone !== "string" ||
    typeof workHours !== "string" ||
    typeof gpsLocation !== "string" ||
    typeof description !== "string" ||
    typeof shortDescription !== "string" ||
    typeof branding !== "string"
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
        logoUrl,
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
        logoUrl,
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
  redirect({ href: "/agency/profile/details", locale: "mk" });
}

function validPhoneNumber(phone: string) {
  return true;
}
function generateUniqueToken() {
  return Math.random().toString(36).slice(2, 11); // Simple token generation
}

export async function checkVerificationTokenInDB(token: string) {
  const verificationLink = await prismadb.verificationLink.findUnique({
    where: {
      token,
    },
  });
  if (verificationLink && verificationLink.isActivated) {
    return { success: false, error: "Account already verified" };
  }
  if (
    verificationLink &&
    verificationLink.isActivated &&
    new Date().getTime() > verificationLink.expiresAt.getTime()
  ) {
    return { success: false, error: "Token expired" };
  }
  if (
    verificationLink &&
    !verificationLink.isActivated &&
    new Date().getTime() < verificationLink.expiresAt.getTime()
  ) {
    await prismadb.verificationLink.update({
      where: {
        id: verificationLink.id,
      },
      data: {
        isActivated: true,
        activatedAt: new Date(),
      },
    });
    return { success: true, error: null };
  } else {
    return { success: false, error: "There was some mistake" };
  }
}
export async function getVerificationLink(accountId: number) {
  const token = generateUniqueToken(); // Function to generate a unique token
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiration

  // Create the verification link in the database
  await prismadb.verificationLink.create({
    data: {
      accountId,
      token,
      expiresAt,
    },
  });

  return `${process.env.NEXT_PUBLIC_URL}/verify?token=${token}`; // Return the verification link
}

// Function to generate a unique token

export async function sendVerificationEmail(
  email: string,
  verificationLink: string,
) {
  console.log("verificationLink 2 ", verificationLink);

  const emailTemp = "macesmajli@gmail.com";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send/verifyuser`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: emailTemp, verificationLink }),
    },
  );
  // console.log("response", response);

  if (!response.ok) {
    throw new Error("Failed to send verification email");
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  console.log("Verification email sent successfully");
  return true;
}
export async function updateAgencyInfo(formData: FormData) {
  const { agency } = await getCurrentUser();
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
  redirect({ href: "/agency/profile/info", locale: "mk" });

  return {
    success: true,
    error: null,
  };
}

export async function updateUserInfo(formData: FormData) {
  const { agency } = await getCurrentUser();
  if (!agency) {
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

  // update user info
  await prismadb.user.update({
    where: {
      id: agency.id,
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
