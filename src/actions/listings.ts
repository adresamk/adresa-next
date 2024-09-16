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
