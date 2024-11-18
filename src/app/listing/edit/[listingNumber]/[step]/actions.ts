"use server";

import prismadb from "@/lib/db";
import { validateRequest } from "@/lib/auth";
import { ListingContactData } from "@/lib/types";
import { Listing } from "@prisma/client";
import { error } from "console";
export interface EditListingResponse {
  data?: {
    listing: Listing;
  };
  success: boolean;
  error?: string;
}

export async function attachImagesToListing(
  images: string[],
  listingNumber: number,
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
      mainImage: images[0],
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
      success: false,
      error: "Invalid type",
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
      success: false,
      error: "Listing not found",
    };
  }
  let updatedListing = null;
  if (listing.type !== type) {
    updatedListing = await prismadb.listing.update({
      where: {
        id: listingId,
      },
      data: {
        type,
      },
    });
  }
  return {
    success: true,
    error: "",
    data: {
      listing: updatedListing ? updatedListing : listing,
    },
  };
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
      success: false,
      error: "Invalid Inputs",
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
      success: false,
      error: "Listing not found",
    };
  }

  const updatedListing = await prismadb.listing.update({
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
      fullAddress: `${manucipality}, ${place}, ${district}, ${address}`,
    },
  });

  return {
    success: true,
    data: {
      listing: updatedListing,
    },
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
      success: false,
      error: "Invalid Inputs",
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
      success: false,
      error: "Listing not found",
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

  const updatedListing = await prismadb.listing.update({
    where: {
      id: listingId,
    },
    data: {
      area: Number(area),
      price: Number(price.replace(/\,/g, "")),
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
    data: {
      listing: updatedListing,
    },
  };
}
async function editFeatures(formData: FormData) {
  return {
    success: true,
  };
}
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
      success: false,
      error: "Invalid Inputs",
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
      success: false,
      error: "Listing not found",
    };
  }

  const updatedListing = await prismadb.listing.update({
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
    data: {
      listing: updatedListing,
    },
  };
}
async function editMedia(formData: FormData) {
  const videoLink = formData.get("videoLink");

  if (typeof videoLink !== "string") {
    return {
      success: false,
      error: "Invalid Inputs",
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
      success: false,
      error: "Listing not found",
    };
  }

  const updatedListing = await prismadb.listing.update({
    where: {
      id: listingId,
    },
    data: {
      videoLink,
    },
  });
  return {
    success: true,
    data: {
      listing: updatedListing,
    },
  };
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
      success: false,
      error: "Invalid Inputs",
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
      success: false,
      error: "Listing not found",
    };
  }
  const updatedListing = await prismadb.listing.update({
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

  return {
    success: true,
    data: {
      listing: updatedListing,
    },
  };
}
async function editPublishing(formData: FormData) {
  const isPublished = formData.get("isPublished");
  if (typeof isPublished !== "string") {
    return {
      success: false,
      error: "Invalid Inputs",
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
      success: false,
      error: "Listing not found",
    };
  }
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  const updatedListing = await prismadb.listing.update({
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
    data: {
      listing: updatedListing,
    },
  };
}
export async function editListing(
  prevState: EditListingResponse,
  formData: FormData,
) {
  console.log("Editing listing", formData);

  const step = formData.get("step");

  if (typeof step !== "string" || Number(step) < 0 || Number(step) > 8) {
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

  let output: EditListingResponse = {
    success: false,
  };

  switch (Number(step)) {
    case 1:
      output = await editType(formData);
      break;
    case 2:
      output = await editLocation(formData);
      break;
    case 3:
      output = await editCharacteristics(formData);
      break;
    case 4:
      output = await editFeatures(formData);
      break;
    case 5:
      output = await editDescription(formData);
      break;
    case 6:
      output = await editMedia(formData);
      break;
    case 7:
      output = await editContactDetails(formData);
      break;
    case 8:
      output = await editPublishing(formData);
      break;
    default:
      break;
  }
  return output;
}
