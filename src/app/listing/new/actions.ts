"use server";

import { validateRequest } from "@/lib/auth";
import prismadb from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addNewListing(formData: FormData) {
  const { user } = await validateRequest();
  if (!user) {
    cookies().set("signin-redirect", "/listing/new");
    redirect("/signin");

    return {
      success: false,
      error: "Unauthenticated",
    };
  }

  console.log("Adding new listing", formData);

  const category = formData.get("category")?.toString();
  const type = formData.get("type")?.toString();
  const transactionType = formData.get("transactionType")?.toString();

  // validate the form data
  if (!category || !type || !transactionType) {
    return {
      success: false,
      error: "Invalid form data",
    };
  }

  // create listing
  const listing = await prismadb.listing.create({
    data: {
      category: category,
      type: type,
      transactionType: transactionType,
      userId: user.id,
    },
  });

  console.log("Listing created", listing);
  // not needed we are adding hidden field for listing id
  // cookies().set("listingId", listing.id);
  redirect("/listing/edit/" + listing.id);
}
