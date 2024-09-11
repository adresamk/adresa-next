"use server";

import { validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createListing() {
  const { user, session } = await validateRequest();
  if (!session) {
    cookies().set("next-redirect", "/listing/new");
    redirect("/signin");
  } else {
    redirect("/listing/new");
  }
}
