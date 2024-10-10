"use server";

import { getUser, validateRequest } from "@/lib/auth";
import prismadb from "@/lib/db";

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
