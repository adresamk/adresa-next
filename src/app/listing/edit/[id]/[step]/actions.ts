"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

function publishListing(formData: FormData) {
  cookies().delete("listingId");
  redirect("/");
}
export async function editListing(formData: FormData) {
  console.log("Editing listing", formData);

  const step = formData.get("step");

  if (
    typeof step !== "string" ||
    Number(step) < 0 ||
    Number(step) > 8
  ) {
    return {
      error: "Invalid step",
      success: false,
    };
  }

  if (Number(step) === 8) {
    publishListing(formData);
  }
}
