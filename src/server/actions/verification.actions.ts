"use server";

import prismadb from "@/lib/db";
import { generateUniqueToken } from "@/lib/utils";

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
  try {
    await prismadb.verificationLink.create({
      data: {
        accountId,
        token,
        expiresAt,
      },
    });
  } catch (error) {
    console.error("Verif link creation", error);
  }

  return `${process.env.NEXT_PUBLIC_URL}/verify?token=${token}`; // Return the verification link
}
