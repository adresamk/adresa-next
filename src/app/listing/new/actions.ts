"use server";

import { setCookie } from "@/actions/cookies";
import { getUser, validateRequest } from "@/lib/auth";
import prismadb from "@/lib/db";
import { ListingContactData } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addNewListing(formData: FormData) {
  const user = await getUser();
  if (!user) {
    // await setCookie("signin-redirect", "/listing/new");
    // cookies().set("signin-redirect", "/listing/new");
    redirect("/signin?redirect=/listing/new");

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

  const listingNumber = await prismadb.counter.findUnique({
    where: {
      name: "listing-number-value",
    },
  })!;

  if (!listingNumber) {
    return {
      success: false,
      error: "Listing number not found",
    };
  }

  // create listing
  const listing = await prismadb.listing.create({
    data: {
      category: category,
      type: type,
      transactionType: transactionType,
      userId: user.id,
      listingNumber: listingNumber.value + 1,
      contactData: JSON.stringify({
        email: user.email,
        emailVerified: user.emailVerified ? true : false,
        phone: user.phone,
        phoneVerified: user.phoneVerified ? true : false,
        firstName: user.firstName,
        lastName: user.lastName,
        contactHours: "anytime",
      } as ListingContactData),
    },
  });

  // increment by 1
  await prismadb.counter.update({
    where: {
      name: "listing-number-value",
    },
    data: {
      value: {
        increment: 1,
      },
    },
  });

  console.log("Listing created", listing);

  redirect("/listing/edit/" + listing.listingNumber + "/location");
}
