"use server";

import { getUser, validateRequest } from "@/lib/auth";
import prismadb from "@/lib/db";
import { capitalizeString } from "@/lib/utils";

export async function updateAgencyDetails(formData: FormData) {
  // id                    String  @id @default(uuid())
  // name                  String? @unique
  // slug                  String? @unique
  // address               String?
  // website               String?
  // phone                 String?
  // logoUrl               String?
  // contactPersonFullName String?
  // contactPersonEmail    String?
  // contactPersonPhone    String?
  // workHours             String?

  // gpsLocation      String? // lng,lat
  // description      String?
  // shortDescription String?
  // branding         String? /

  const user = await getUser();
  if (!user || !user.agencyId) {
    return {
      success: false,
      error: "Unauthenticated",
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

  await prismadb.agency.update({
    where: {
      id: user.agencyId,
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
export async function getVerificationLink(userId: string) {
  const token = generateUniqueToken(); // Function to generate a unique token
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiration

  // Create the verification link in the database
  await prismadb.verificationLink.create({
    data: {
      userId,
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
