"use server";

import { validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createListing() {
  const { user, session } = await validateRequest();
  if (!session) {
    redirect("/signin?redirect=/listing/new");
  } else {
    redirect("/listing/new");
  }
}

export async function addListingAsFavorite(listingId: string) {
  const { user } = await validateRequest();

  if (!user) {
    return {
      status: 401,
      success: false,
      error: "Unauthorized",
    };
  }
}

export async function removeListingAsFavorite(listingId: string) {
  const { user } = await validateRequest();

  if (!user) {
    return {
      status: 401,
      success: false,
      error: "Unauthorized",
    };
  }
}
