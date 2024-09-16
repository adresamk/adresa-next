"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prismadb from "@/lib/db";
import { validateRequest } from "@/lib/auth";
import { ListingContactData } from "@/lib/types";

export async function attachImagesToListing(
  images: string[],
  listingNumber: number
) {
  const { user } = await validateRequest();
  if (!user) {
    return {
      success: false,
      error: "Unauthenticated to upload images",
    };
  }

  const listing = await prismadb.listing.findFirst({
    where: {
      listingNumber,
    },
  });

  if (!listing) {
    return {
      success: false,
      error: "Listing not found",
    };
  }

  await prismadb.listing.update({
    where: {
      id: listing.id,
    },
    data: {
      images,
    },
  });

  return {
    success: true,
  };
}

async function editType(formData: FormData) {
  const type = formData.get("type");
  if (typeof type !== "string") {
    return {
      error: "Invalid type",
      success: false,
    };
  }

  const listingId = formData.get("listingId")! as string;
  const listing = await prismadb.listing.findUnique({
    where: {
      id: listingId!,
    },
  });

  if (!listing) {
    return {
      error: "Listing not found",
      success: false,
    };
  }

  if (listing.type !== type) {
    await prismadb.listing.update({
      where: {
        id: listingId,
      },
      data: {
        type,
      },
    });

    return {
      success: true,
    };
  }
}
async function editLocation(formData: FormData) {
  const manucipality = formData.get("manucipality");
  const place = formData.get("place");
  const district = formData.get("district");
  const address = formData.get("address");
  const longitude = formData.get("longitude");
  const latitude = formData.get("latitude");

  if (
    typeof manucipality !== "string" ||
    typeof place !== "string" ||
    typeof district !== "string" ||
    typeof address !== "string" ||
    typeof longitude !== "string" ||
    typeof latitude !== "string"
  ) {
    return {
      error: "Invalid Inputs",
      success: false,
    };
  }

  const listingId = formData.get("listingId")! as string;
  const listing = await prismadb.listing.findUnique({
    where: {
      id: listingId!,
    },
  });

  if (!listing) {
    return {
      error: "Listing not found",
      success: false,
    };
  }

  await prismadb.listing.update({
    where: {
      id: listingId,
    },
    data: {
      manucipality,
      place,
      district,
      address,
      longitude: Number(longitude),
      latitude: Number(latitude),
    },
  });

  return {
    success: true,
  };
}
async function editCharacteristics(formData: FormData) {
  const price = formData.get("price");
  const area = formData.get("area");
  const floorNumber = formData.get("floorNumber");
  const orientation = formData.get("orientation");
  const bedrooms = formData.get("bedrooms");
  const bathrooms = formData.get("bathrooms");
  const wcs = formData.get("wcs");
  const kitchens = formData.get("kitchens");
  const livingRooms = formData.get("livingRooms");
  const parking = formData.get("parking");
  const elevator = formData.get("elevator");
  const balcony = formData.get("balcony");
  const yard = formData.get("yard");
  const basement = formData.get("basement");

  if (
    typeof price !== "string" ||
    typeof area !== "string" ||
    typeof floorNumber !== "string" ||
    typeof orientation !== "string" ||
    typeof bedrooms !== "string" ||
    typeof bathrooms !== "string" ||
    typeof wcs !== "string" ||
    typeof kitchens !== "string" ||
    typeof livingRooms !== "string" ||
    typeof parking !== "string" ||
    typeof elevator !== "string" ||
    typeof balcony !== "string" ||
    typeof yard !== "string" ||
    typeof basement !== "string"
  ) {
    return {
      error: "Invalid Inputs",
      success: false,
    };
  }
  const listingId = formData.get("listingId")! as string;
  const listing = await prismadb.listing.findUnique({
    where: {
      id: listingId!,
    },
  });

  if (!listing) {
    return {
      error: "Listing not found",
      success: false,
    };
  }

  function featuresValue(value: string) {
    if (value === "yes") {
      return true;
    }
    if (value === "no") {
      return false;
    }
    if (value === "idk") {
      return undefined;
    }
  }

  await prismadb.listing.update({
    where: {
      id: listingId,
    },
    data: {
      area: Number(area),
      price: Number(price.replace(/\./g, "")),
      floorNumber: Number(floorNumber),
      orientation,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      wcs: Number(wcs),
      kitchens: Number(kitchens),
      livingRooms: Number(livingRooms),
      parking: featuresValue(parking),
      elevator: featuresValue(elevator),
      balcony: featuresValue(balcony),
      yard: featuresValue(yard),
      basement: featuresValue(basement),
    },
  });

  return {
    success: true,
  };
}
async function editFeatures(formData: FormData) {}
async function editDescription(formData: FormData) {
  const description = formData.get("description");
  const mkdDescription = formData.get("mkdDescription");
  const albDescription = formData.get("albDescription");

  if (
    typeof description !== "string" ||
    typeof mkdDescription !== "string" ||
    typeof albDescription !== "string"
  ) {
    return {
      error: "Invalid Inputs",
      success: false,
    };
  }

  const listingId = formData.get("listingId")! as string;
  const listing = await prismadb.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    return {
      error: "Listing not found",
      success: false,
    };
  }

  await prismadb.listing.update({
    where: {
      id: listingId,
    },
    data: {
      description,
      mkdDescription,
      albDescription,
    },
  });

  return {
    success: true,
  };
}
async function editMedia(formData: FormData) {
  const videoLink = formData.get("videoLink");

  if (typeof videoLink !== "string") {
    return {
      error: "Invalid Inputs",
      success: false,
    };
  }

  const listingId = formData.get("listingId")! as string;
  const listing = await prismadb.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    return {
      error: "Listing not found",
      success: false,
    };
  }

  await prismadb.listing.update({
    where: {
      id: listingId,
    },
    data: {
      videoLink,
    },
  });
}
async function editContactDetails(formData: FormData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const contactHours = formData.get("contactHours");

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof contactHours !== "string"
  ) {
    return {
      error: "Invalid Inputs",
      success: false,
    };
  }

  const listingId = formData.get("listingId")! as string;
  const listing = await prismadb.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    return {
      error: "Listing not found",
      success: false,
    };
  }
  await prismadb.listing.update({
    where: {
      id: listingId,
    },
    data: {
      contactData: JSON.stringify({
        firstName,
        lastName,
        email,
        emailVerified: false,
        phone,
        phoneVerified: false,
        contactHours,
      } as ListingContactData),
    },
  });
}
async function editPublishing(formData: FormData) {
  const isPublished = formData.get("isPublished");
  if (typeof isPublished !== "string") {
    return {
      error: "Invalid Inputs",
      success: false,
    };
  }

  const makePublished = isPublished === "yes" ? true : false;

  const listingId = formData.get("listingId")! as string;
  const listing = await prismadb.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    return {
      error: "Listing not found",
      success: false,
    };
  }
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  await prismadb.listing.update({
    where: {
      id: listingId,
    },
    data: {
      isPublished: makePublished,
      publishedAt: makePublished ? new Date() : null,
      publishEndDate: makePublished ? oneMonthFromNow : null,
    },
  });
  return {
    success: true,
  };
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
  const listingId = formData.get("listingId");

  if (typeof listingId !== "string") {
    return {
      error: "Missing listing ID",
      success: false,
    };
  }

  switch (Number(step)) {
    case 1:
      editType(formData);
      break;
    case 2:
      editLocation(formData);
      break;
    case 3:
      editCharacteristics(formData);
      break;
    case 4:
      editFeatures(formData);
      break;
    case 5:
      editDescription(formData);
      break;
    case 6:
      editMedia(formData);
      break;
    case 7:
      editContactDetails(formData);
      break;
    case 8:
      editPublishing(formData);
      break;
    default:
      break;
  }
}
