"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addNewListing(formData: FormData) {
  console.log("Adding new listing", formData);

  // create listing

  // redirect to edit/ID

  cookies().set("listingId", "1");
  redirect("/listing/edit/1");
}
