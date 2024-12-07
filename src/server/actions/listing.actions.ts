"use server";

import { validateRequest } from "@/lib/auth";
import prismadb from "@/lib/db";
import { ListingWithOwnerAndAgency } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { getUser } from "@/lib/auth";
import { ListingContactData } from "@/lib/types";
import { cookies } from "next/headers";
import {
  Listing,
  PropertyCategory,
  PropertyTransactionType,
  PropertyType,
} from "@prisma/client";
import { getCurrentSession, getCurrentUser } from "@/lib/sessions";

export async function createListing() {
  const { session } = await getCurrentSession();
  if (!session) {
    redirect("/signin?redirect=/listing/new");
  } else {
    redirect("/listing/new");
  }
}

export async function addListingAsFavorite(listingId: number) {
  // const { user } = await validateRequest();
  const { user } = await getCurrentUser();

  if (!user) {
    return {
      status: 401,
      success: false,
      error: "Unauthorized",
    };
  }

  // Check if favorite already exists
  const existingFavorite = await prismadb.favorite.findFirst({
    where: {
      userId: user.id,
      listingId: listingId,
    },
  });

  if (existingFavorite) {
    console.log("Favorite already exists");
    return {
      status: 200,
      success: true,
      error: "Favorite already exists",
    };
  }

  // Create new favorite if it doesn't exist
  await prismadb.favorite.create({
    data: {
      userId: user.id,
      listingId: listingId,
    },
  });

  return {
    status: 200,
    success: true,
    error: null,
  };
}

export async function removeListingAsFavorite(listingId: number) {
  const { user } = await getCurrentUser();

  if (!user) {
    return {
      status: 401,
      success: false,
      error: "Unauthorized",
    };
  }

  await prismadb.favorite.delete({
    where: {
      userId_listingId: {
        userId: user.id,
        listingId: listingId,
      },
    },
  });
  return {
    status: 200,
    success: true,
    error: null,
  };
}

export async function getLikedListingsByUser() {
  const { user } = await getCurrentUser();

  if (!user) {
    return null;
  }
  const likedListingsByUser = await prismadb.favorite.findMany({
    where: {
      userId: user.id,
    },
    select: {
      listing: true,
    },
  });

  // Extract listings from the result
  const listings = likedListingsByUser.map((favorite) => favorite.listing);

  return listings;
}

export async function deleteListing(formData: FormData) {
  // console.log(formData);
  const listingId = formData.get("listingId")?.valueOf();

  if (typeof listingId !== "string" || !listingId) {
    return {
      success: false,
      error: "Listing ID necessary",
    };
  }

  const { session } = await getCurrentSession();

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  await prismadb.listing.delete({
    where: {
      id: Number(listingId),
    },
  });

  revalidatePath("/profile/listings");
  return {
    success: true,
    error: false,
  };
}

export async function adjustListingVisibility(formData: FormData) {
  // console.log(formData);
  const listingId = formData.get("listingId")?.valueOf();
  const isVisible = formData.get("isVisible")?.valueOf();

  if (typeof listingId !== "string" || !listingId) {
    return {
      success: false,
      error: "Listing ID necessary",
    };
  }

  if (
    typeof isVisible !== "string" ||
    (isVisible !== "true" && isVisible !== "false")
  ) {
    return {
      success: false,
      error: "isVisible is incorrect value",
    };
  }
  const { session } = await getCurrentSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const wasVisible = isVisible === "true";
  await prismadb.listing.update({
    where: {
      id: Number(listingId),
    },
    data: {
      isVisible: !wasVisible,
    },
  });

  revalidatePath("/profile/listings");
  return {
    success: true,
    error: false,
  };
}

export async function getListing(listingNumber: number) {
  try {
    const listing = await prismadb.listing.findUnique({
      where: {
        listingNumber: listingNumber,
      },
      include: {
        agency: true,
        user: true,
      },
    });

    if (!listing) {
      notFound();
    }

    // Clean up the data for serialization
    // const serializedListing = {
    //   ...listing,
    //   createdAt: listing.createdAt.toISOString(),
    //   updatedAt: listing.updatedAt.toISOString(),
    //   owner: {
    //     ...listing.owner,
    //     agency: listing.owner.agency
    //       ? {
    //           ...listing.owner.agency,
    //         }
    //       : null,
    //   },
    // };

    return listing;
  } catch (error) {
    console.error("Error fetching listing:", error);
    notFound();
  }
}

export async function getFavoriteStatus(listingId: number) {
  const { user } = await getCurrentUser();
  if (!user) return false;

  const favorite = await prismadb.favorite.findFirst({
    where: {
      listingId,
      userId: user.id,
    },
  });

  return !!favorite;
}

export async function addNewListing(formData: FormData) {
  // console.log("Adding new listing", formData);
  const { user, agency } = await getCurrentUser();
  if (!user) {
    const cookieStore = await cookies();
    // cookieStore.set("signin-redirect", "/listing/new");
    redirect("/signin?redirect=/listing/new");

    return {
      success: false,
      error: "Unauthenticated",
    };
  }

  // console.log("Adding new listing", formData);

  const category = formData.get("category")?.toString();
  const type = formData.get("type")?.toString();
  const transactionType = formData.get("transactionType")?.toString();

  // validate the form data
  if (
    typeof category !== "string" ||
    typeof type !== "string" ||
    typeof transactionType !== "string"
  ) {
    return {
      success: false,
      error: "Invalid form data",
    };
  }

  let listingNumber = await prismadb.counter.findUnique({
    where: {
      name: "listing-number-counter",
    },
  });

  // will be missing if we restart the db, and initiall we need to create the counter
  if (!listingNumber) {
    listingNumber = await prismadb.counter.create({
      data: {
        name: "listing-number-counter",
        value: 10001,
      },
    });
  }

  // TODO: create a way to separate contact data
  // create listing
  const listing = await prismadb.listing.create({
    data: {
      category: category as PropertyCategory,
      type: type as PropertyType,
      transactionType: transactionType as PropertyTransactionType,
      userId: user.id,
      listingNumber: listingNumber.value + 1,
      contactData: JSON.stringify({
        email: user ? "user.email" : agency?.contactPersonEmail,
        emailVerified: user ? true : false,
        phone: user ? user.phone : agency?.contactPersonPhone,
        phoneVerified: user ? user.phoneVerified : false,
        firstName: user
          ? user.firstName
          : agency?.contactPersonFullName?.split(" ")[0],
        lastName: user
          ? user.lastName
          : agency?.contactPersonFullName?.split(" ")[1],
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

  // console.log("Listing created", listing);

  redirect("/listing/edit/" + listing.listingNumber + "/location");
}

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
  const { user } = await getCurrentUser();
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
      id: Number(listingId),
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
        id: Number(listingId),
      },
      data: {
        type: type as PropertyType,
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
  const municipality = formData.get("municipality");
  const place = formData.get("place");
  // const district = formData.get("district");
  const address = formData.get("address");
  // const longitude = formData.get("longitude");
  // const latitude = formData.get("latitude");
  const coordinates = formData.get("coordinates");

  // console.log({ municipality, place, address, coordinates });

  if (
    typeof municipality !== "string" ||
    typeof place !== "string" ||
    // typeof district !== "string" ||
    typeof address !== "string" ||
    typeof coordinates !== "string"
    // typeof longitude !== "string" ||
    // typeof latitude !== "string"
  ) {
    return {
      success: false,
      error: "Invalid Inputs",
    };
  }

  const listingId = formData.get("listingId")! as string;
  const listing = await prismadb.listing.findUnique({
    where: {
      id: Number(listingId),
    },
  });

  if (!listing) {
    return {
      success: false,
      error: "Listing not found",
    };
  }

  const [latitude, longitude] = coordinates.split(",");
  const updatedListing = await prismadb.listing.update({
    where: {
      id: Number(listingId),
    },
    data: {
      municipality,
      place,
      // district,
      address,
      longitude: Number(longitude),
      latitude: Number(latitude),
      // fullAddress: `${municipality}, ${place}, ${district}, ${address}`,
      fullAddress: `${municipality}, ${place}, ${address}`,
    },
  });

  // console.log("updatedListing", updatedListing);
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
      id: Number(listingId),
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
  }

  const updatedListing = false;
  // const updatedListing = await prismadb.listing.update({
  //   where: {
  //     id: Number(listingId),
  //   },
  //   data: {
  //     area: Number(area),
  //     price: Number(price.replace(/\,/g, "")),
  //     floorNumber: floorNumber,
  //     orientation,
  //     bedrooms: Number(bedrooms),
  //     bathrooms: Number(bathrooms),
  //     wcs: Number(wcs),
  //     kitchens: Number(kitchens),
  //     livingRooms: Number(livingRooms),
  //     parking: featuresValue(parking),
  //     elevator: featuresValue(elevator),
  //     balcony: featuresValue(balcony),
  //     yard: featuresValue(yard),
  //     basement: featuresValue(basement),
  //   },
  // });

  return {
    success: true,
    data: {
      listing: updatedListing ? updatedListing : listing,
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
  const title = formData.get("title");
  const mkdTitle = formData.get("mkdTitle");
  const albTitle = formData.get("albTitle");

  if (
    typeof description !== "string" ||
    typeof mkdDescription !== "string" ||
    typeof albDescription !== "string" ||
    typeof title !== "string" ||
    typeof mkdTitle !== "string" ||
    typeof albTitle !== "string"
  ) {
    return {
      success: false,
      error: "Invalid Inputs",
    };
  }

  const listingId = formData.get("listingId")! as string;
  const listing = await prismadb.listing.findUnique({
    where: {
      id: Number(listingId),
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
      id: Number(listingId),
    },
    data: {
      description,
      mkdDescription,
      albDescription,
      title,
      mkdTitle,
      albTitle,
    },
  });

  // console.log("returned ", updatedListing);
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
      id: Number(listingId),
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
      id: Number(listingId),
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
      id: Number(listingId),
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
      id: Number(listingId),
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
      id: Number(listingId),
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
      id: Number(listingId),
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
  // console.log("Editing listing", formData);

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

export default async function getAllListings(
  search: string = "",
): Promise<Listing[]> {
  // console.log("this is the search on the server", search);

  // const { user } = await getCurrentUser();

  const listings = await prismadb.listing.findMany({
    where: {
      isPublished: true,
    },
    take: 20,
    include: {
      // owner: true,
      favoritedBy: {
        select: {
          userId: true,
        },
      },
    },
  });
  // Optimize with this
  //   // Assuming you have the current userId from session or JWT
  // const currentUserId = 'some-user-id';

  // // Step 1: Fetch all published listings
  // const listings = await prismadb.listing.findMany({
  //   where: {
  //     isPublished: true,
  //   },
  // });

  // // Step 2: Fetch the IDs of listings favorited by the current user
  // const userFavorites = await prismadb.favorite.findMany({
  //   where: {
  //     userId: currentUserId,
  //   },
  //   select: {
  //     listingId: true,
  //   },
  // });

  // // Create a set of favorited listing IDs for faster lookup
  // const favoritedListingIds = new Set(userFavorites.map(fav => fav.listingId));

  // // Step 3: Add a `isFavorited` property to each listing
  // const listingsWithFavoriteInfo = listings.map(listing => ({
  //   ...listing,
  //   isFavorited: favoritedListingIds.has(listing.id),
  // }));

  // // Now `listingsWithFavoriteInfo` contains all listings with `isFavorited` marked for the current user
  // return listingsWithFavoriteInfo;

  // console.log("returned listings ; ", listings.length);
  return listings;
}
