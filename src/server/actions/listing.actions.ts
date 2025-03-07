"use server";

import prismadb from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { notFound } from "next/navigation";
import { redirect, routing } from "@/i18n/routing";
import { IResult, UAParser } from "ua-parser-js";

import {
  CommercialPropertyType,
  LandPropertyType,
  Listing,
  ListingStatus,
  LocationPrecision,
  OtherPropertyType,
  PropertyCategory,
  PropertyTransactionType,
  PropertyType,
  ResidentalPropertyType,
} from "@prisma/client";
import { getCurrentSession, getCurrentUser } from "@/lib/sessions";
import {
  ExternalListingData,
  ListingWithRelations,
  listingWithRelationsInclude,
  UploadedImageData,
} from "@/types/listing.types";
import { ParsedQueryParams } from "@/lib/filters";
import { getLocale } from "next-intl/server";
import { checkListingCompleteness } from "@/lib/utils";
import {
  categoryMatcher,
  municipalityMatcher,
  placeMatcher,
  tagsMatcher,
  typeMatcher,
} from "@/app/api/listing/webhook/create/matcher";
import { de, tr } from "@faker-js/faker";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { notifyConcernedUsersAboutNewListing } from "./notifications.actions";
import { ActionResult } from "@/components/Form";
export async function revalidateListingPage(listingNumber: number) {
  // Revalidate the specific listing page across all locales
  routing.locales.forEach((locale) => {
    revalidatePath(`/${locale}/listing/${listingNumber}`);
  });
  // Also revalidate listing-related tags
  // revalidateTag("listings");
}

// Add this function to generate static page when listing becomes active
export async function generateStaticListingPage(listingNumber: number) {
  try {
    // Generate static pages for all locales
    const promises = routing.locales.map(async (locale) => {
      const url = `${process.env.NEXT_PUBLIC_URL}/${locale}/listing/${listingNumber}`;
      await fetch(url, { method: "GET" });
    });

    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("Failed to generate static page:", error);
    return false;
  }
}
export async function getListingsByIdForRecentlyViewed(
  listingNumbers: number[],
) {
  const listings = await prismadb.listing.findMany({
    where: {
      listingNumber: {
        in: listingNumbers,
      },
    },
  });
  return listings;
}

export async function addListingAsFavorite(listingId: number, userId: number) {
  // Check if favorite already exists
  const existingFavorite = await prismadb.favorite.findFirst({
    where: {
      userId: userId,
      listingId: listingId,
    },
  });

  console.log("existingFavorite", existingFavorite);
  console.log("userId", userId);
  console.log("listingId", listingId);
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
      userId: userId,
      listingId: listingId,
    },
  });

  return {
    status: 200,
    success: true,
    error: null,
  };
}

export async function removeListingAsFavorite(
  listingId: number,
  userId: number,
) {
  await prismadb.favorite.delete({
    where: {
      userId_listingId: {
        userId: userId,
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

export async function getLikedListingsByUser(userId: number) {
  const likedListingsByUser = await prismadb.favorite.findMany({
    where: {
      userId: userId,
    },
    select: {
      listing: true,
    },
  });
  console.log(userId, likedListingsByUser);

  // Extract listings from the result
  const listings = likedListingsByUser.map((favorite) => ({
    ...favorite.listing,
    favoritedBy: [userId],
  }));

  return listings;
}

export async function deleteListing(listingId: number) {
  try {
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
  } catch (error) {
    console.error("Error deleting listing:", error);
    return {
      success: false,
      error: "Error deleting listing",
    };
  }
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
      status: wasVisible ? ListingStatus.INACTIVE : ListingStatus.ACTIVE,
      substatus: wasVisible ? "user_hidden" : "",
    },
  });

  revalidatePath("/profile/listings");
  return {
    success: true,
    error: false,
  };
}

export async function getListing(listingNumber: number) {
  if (isNaN(listingNumber)) {
    console.log("listingNumber is NaN", typeof listingNumber, listingNumber);
  }
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

export async function saveListingInterest(
  prevState: {
    success: boolean;
    error: string | null;
  },
  formData: FormData,
) {
  console.log("saveListingInterest", formData);

  const listingId = formData.get("listingId")?.valueOf();
  const ownerId = formData.get("ownerId")?.valueOf();
  const ownerType = formData.get("ownerType")?.valueOf();
  const fullName = formData.get("fullName")?.valueOf();
  const email = formData.get("email")?.valueOf();
  const phone = formData.get("phone")?.valueOf();
  const message = formData.get("message")?.valueOf();
  const senderAccountId = formData.get("senderAccountId")?.valueOf();
  if (
    typeof listingId !== "string" ||
    typeof ownerId !== "string" ||
    typeof ownerType !== "string" ||
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    typeof phone !== "string"
  ) {
    return {
      success: false,
      error: "Invalid form data",
    };
  }
  try {
    const listingInterestMessage = await prismadb.listingInterestMessage.create(
      {
        data: {
          listingId: Number(listingId),
          ownerId: Number(ownerId),
          ownerType: ownerType,
          fullName: fullName,
          email: email,
          phone: phone,
          message: message,
          senderAccountId: senderAccountId ? Number(senderAccountId) : null,
        },
      },
    );
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error creating listing interest message:", error);
    return {
      success: false,
      error: "Error creating listing interest message",
    };
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

export async function createNewListing(formData: FormData) {
  // console.log("Adding new listing", formData);
  const { isAuthenticated, user, agency } = await getCurrentUser();
  const locale = await getLocale();

  if (!isAuthenticated || (!user && !agency)) {
    // const cookieStore = await cookies();
    // cookieStore.set("signin-redirect", "/listing/new");
    redirect({
      href: "/signin?redirect=/listing/new",
      locale: locale,
    });

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

  // let listingNumber = await prismadb.counter.findUnique({
  //   where: {
  //     name: "listing-number-counter",
  //   },
  // });

  // will be missing if we restart the db, and initiall we need to create the counter
  // if (!listingNumber) {
  //   listingNumber = await prismadb.counter.create({
  //     data: {
  //       name: "listing-number-counter",
  //       value: 10000,
  //     },
  //   });
  // }

  // TODO: create a way to separate contact data
  // create listing
  const listing = await prismadb.listing.create({
    data: {
      uuid: crypto.randomUUID(),
      transactionType: transactionType as PropertyTransactionType,
      category: category as PropertyCategory,
      type: type as PropertyType,
      userId: user ? user.id : null,
      agencyId: agency ? agency.id : null,
      // listingNumber: listingNumber.value + 1,
      queryHash: "", // Will be updated later

      // Only create the relevant subcategory based on category
      ...(category === "residential"
        ? {
            residential: {
              create: {
                propertyType: type as ResidentalPropertyType,
                // You might want to make this a parameter
              },
            },
            commercial: undefined,
            land: undefined,
            other: undefined,
          }
        : category === "commercial"
          ? {
              residential: undefined,
              commercial: {
                create: {
                  propertyType: type as CommercialPropertyType,
                },
              },
              land: undefined,
              other: undefined,
            }
          : category === "land"
            ? {
                residential: undefined,
                commercial: undefined,
                land: {
                  create: {
                    propertyType: type as LandPropertyType,
                  },
                },
                other: undefined,
              }
            : {
                residential: undefined,
                commercial: undefined,
                land: undefined,
                other: {
                  create: {
                    propertyType: type as OtherPropertyType,
                    // Other type doesn't require many fields
                  },
                },
              }),
    },
    // Include the created subcategory in the response
    include: {
      residential: category === "residential",
      commercial: category === "commercial",
      land: category === "land",
      other: category === "other",
    },
  });

  // increment by 1
  await prismadb.counter.update({
    where: {
      name: "listing-number-counter",
    },
    data: {
      value: {
        increment: 1,
      },
    },
  });

  // console.log("Listing created", listing);

  redirect({
    href: "/listing/edit/" + listing.listingNumber + "/location",
    locale: locale,
  });
}

export interface EditListingResponse {
  data?: {
    listing: Listing;
  };
  success: boolean;
  error?: string;
}

export async function attachImagesToListing(
  images: UploadedImageData[],
  listingNumber: number,
) {
  const { user, agency, account } = await getCurrentUser();
  console.log("user", user, agency, account);
  if (!user && !agency) {
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

  console.log("images: ", images);

  await prismadb.listing.update({
    where: {
      id: listing.id,
    },
    data: {
      images: images,
      mainImage: images && images.length > 0 ? images[0] : {},
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
    updatedListing = (await prismadb.listing.findUnique({
      where: {
        id: updatedListing.id,
      },
      include: {
        agency: true,
        user: true,
        commercial: true,
        residential: true,
        land: true,
        other: true,
        listingFeatures: {
          include: {
            feature: true,
          },
        },
      },
    })) as ListingWithRelations;
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
  const locationPrecision = formData.get("locationPrecision");

  // console.log({ municipality, place, address, coordinates });

  if (
    typeof municipality !== "string" ||
    typeof place !== "string" ||
    // typeof district !== "string" ||
    typeof address !== "string" ||
    typeof coordinates !== "string" ||
    typeof locationPrecision !== "string"
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
  await prismadb.listing.update({
    where: {
      id: Number(listingId),
    },
    data: {
      municipality,
      place,
      // district,
      address,
      longitude: Number(Number(longitude).toFixed(6)),
      latitude: Number(Number(latitude).toFixed(6)),
      locationPrecision: locationPrecision as LocationPrecision,
      // fullAddress: `${municipality}, ${place}, ${district}, ${address}`,
      fullAddress: `${municipality}, ${place}, ${address}`,
    },
  });

  const updatedListing = (await prismadb.listing.findUnique({
    where: {
      id: Number(listingId),
    },
    include: {
      agency: true,
      user: true,
      commercial: true,
      residential: true,
      land: true,
      other: true,
      listingFeatures: {
        include: {
          feature: true,
        },
      },
    },
  })) as ListingWithRelations;

  // console.log("updatedListing", updatedListing);
  return {
    success: true,
    data: {
      listing: updatedListing,
    },
  };
}
async function editCharacteristics(formData: FormData) {
  const listingCategory = formData.get("listingCategory");

  if (typeof listingCategory !== "string") {
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

  const category = listingCategory as PropertyCategory;
  console.log("category", category);

  const pricePerAgreement = formData.get("pricePerAgreement");
  const price = formData.get("price");
  const area = formData.get("area");
  const externalRef = formData.get("externalRef");
  console.log("externalRef", externalRef);

  if (
    typeof area !== "string" || // Area is always required
    // Either price OR isPricePerAgreement must be valid
    (typeof price !== "string" && typeof pricePerAgreement !== "string") ||
    (typeof price === "string" && typeof pricePerAgreement === "string")
  ) {
    return {
      success: false,
      error:
        "Invalid Inputs: Area is required and exactly one of price or isPricePerAgreement must be provided",
    };
  }
  console.log("price", price);
  console.log("pricePerAgreement", pricePerAgreement);
  const priceCleaned = price
    ? Number(price.toString().replace(/\D/g, ""))
    : pricePerAgreement === "on"
      ? 0
      : undefined;
  console.log("priceCleaned", priceCleaned);
  await prismadb.listing.update({
    where: {
      id: Number(listingId),
    },
    data: {
      price: priceCleaned,
      area: Number(area),
      externalRef: externalRef ? (externalRef as string) : null,
    },
  });

  if (category === "residential") {
    const residentialId = formData.get("residentialId");

    const floor = formData.get("floor");
    const totalFloors = formData.get("totalFloors");
    const orientation = formData.get("orientation");
    const zone = formData.get("zone");

    const constructionYear = formData.get("constructionYear");
    const totalPropertyArea = formData.get("totalPropertyArea");

    const isFurnished = formData.get("isFurnished");
    const isForStudents = formData.get("isForStudents");
    const isForHolidayHome = formData.get("isForHolidayHome");
    const commonExpenses = formData.get("commonExpenses");
    const heatingType = formData.get("heatingType");
    const heatingMedium = formData.get("heatingMedium");

    const bathroomCount = formData.get("bathroomCount");
    const wcCount = formData.get("wcCount");
    const kitchenCount = formData.get("kitchenCount");
    const livingRoomCount = formData.get("livingRoomCount");
    const bedroomCount = formData.get("bedroomCount");

    console.log({
      residentialId,
      floor,
      totalFloors,
      orientation,
      zone,
      constructionYear,
      totalPropertyArea,
      isFurnished,
      isForStudents,
      isForHolidayHome,
      commonExpenses,
      heatingType,
      heatingMedium,
      bathroomCount,
      wcCount,
      kitchenCount,
      livingRoomCount,
      bedroomCount,
    });

    if (
      typeof residentialId !== "string" ||
      typeof floor !== "string" ||
      typeof totalFloors !== "string" ||
      typeof orientation !== "string" ||
      typeof zone !== "string" ||
      typeof constructionYear !== "string" ||
      typeof totalPropertyArea !== "string" ||
      !(typeof isFurnished === "string" || isFurnished === null) ||
      !(typeof isForStudents === "string" || isForStudents === null) ||
      !(typeof isForHolidayHome === "string" || isForHolidayHome === null) ||
      typeof commonExpenses !== "string" ||
      typeof heatingType !== "string" ||
      typeof heatingMedium !== "string" ||
      typeof bathroomCount !== "string" ||
      typeof wcCount !== "string" ||
      typeof kitchenCount !== "string" ||
      typeof livingRoomCount !== "string" ||
      typeof bedroomCount !== "string"
    ) {
      return {
        success: false,
        error: "Invalid Inputs",
      };
    }

    // update here.
    const residential = await prismadb.residential.findUnique({
      where: {
        id: Number(residentialId),
      },
    });
    if (!residential) {
      return {
        success: false,
        error: "Residential not found",
      };
    }

    await prismadb.residential.update({
      where: {
        id: Number(residentialId),
      },
      data: {
        floor: floor,
        totalFloors: Number(totalFloors),
        orientation: orientation,
        zone: zone,
        constructionYear: Number(constructionYear),
        totalPropertyArea: Number(totalPropertyArea),
        isFurnished: isFurnished === "1",
        isForStudents: isForStudents === "1",
        isForHolidayHome: isForHolidayHome === "1",
        commonExpenses: Number(commonExpenses),
        heatingType,
        heatingMedium,
        bathroomCount: Number(bathroomCount),
        wcCount: Number(wcCount),
        kitchenCount: Number(kitchenCount),
        livingRoomCount: Number(livingRoomCount),
        bedroomCount: Number(bedroomCount),
      },
    });
  }
  if (category === "commercial") {
    const commercialId = formData.get("commercialId");
    const constructionYear = formData.get("constructionYear");
    const totalPropertyArea = formData.get("totalPropertyArea");
    const floor = formData.get("floor");

    const isCornerProperty = formData.get("isCornerProperty");
    const isOnTopFloor = formData.get("isOnTopFloor");

    const accessFrom = formData.get("accessFrom");
    const commonExpenses = formData.get("commonExpenses");
    const heatingType = formData.get("heatingType");
    const heatingMedium = formData.get("heatingMedium");

    const wcCount = formData.get("wcCount");
    console.log({
      commercialId,
      constructionYear,
      totalPropertyArea,
      floor,
      isCornerProperty,
      isOnTopFloor,
      accessFrom,
      commonExpenses,
      heatingType,
      heatingMedium,
      wcCount,
    });

    if (
      typeof commercialId !== "string" ||
      typeof constructionYear !== "string" ||
      typeof totalPropertyArea !== "string" ||
      typeof floor !== "string" ||
      !(typeof isCornerProperty === "string" || isCornerProperty === null) ||
      !(typeof isOnTopFloor === "string" || isOnTopFloor === null) ||
      typeof accessFrom !== "string" ||
      typeof commonExpenses !== "string" ||
      typeof heatingType !== "string" ||
      typeof heatingMedium !== "string" ||
      typeof wcCount !== "string"
    ) {
      return {
        success: false,
        error: "Invalid Inputs",
      };
    }

    // update here.

    const commercial = await prismadb.commercial.findUnique({
      where: {
        id: Number(commercialId),
      },
    });
    if (!commercial) {
      return {
        success: false,
        error: "Commercial not found",
      };
    }

    await prismadb.commercial.update({
      where: {
        id: Number(commercialId),
      },
      data: {
        constructionYear: Number(constructionYear),
        totalPropertyArea: Number(totalPropertyArea),
        floor: Number(floor),
        isCornerProperty: isCornerProperty === "1",
        isOnTopFloor: isOnTopFloor === "1",
        accessFrom: accessFrom,
        commonExpenses: Number(commonExpenses),
        heatingType: heatingType,
        heatingMedium: heatingMedium,
        wcCount: Number(wcCount),
      },
    });
  }
  if (category === "land") {
    const landId = formData.get("landId");
    const isCornerProperty = formData.get("isCornerProperty");
    const orientation = formData.get("orientation");
    const zone = formData.get("zone");
    const accessFrom = formData.get("accessFrom");
    const slope = formData.get("slope");

    console.log({
      landId,
      isCornerProperty,
      orientation,
      zone,
      accessFrom,
      slope,
    });
    if (
      typeof landId !== "string" ||
      !(typeof isCornerProperty === "string" || isCornerProperty === null) ||
      typeof orientation !== "string" ||
      typeof zone !== "string" ||
      typeof accessFrom !== "string" ||
      typeof slope !== "string"
    ) {
      return {
        success: false,
        error: "Invalid Inputs",
      };
    }

    // update here.
    const land = await prismadb.land.findUnique({
      where: {
        id: Number(landId),
      },
    });
    if (!land) {
      return {
        success: false,
        error: "Land not found",
      };
    }

    await prismadb.land.update({
      where: {
        id: Number(landId),
      },
      data: {
        isCornerProperty: isCornerProperty === "1",
        orientation: orientation,
        zone: zone,
        accessFrom: accessFrom,
        slope: slope,
      },
    });
  }
  if (category === "other") {
    const otherId = formData.get("otherId");
    const accessFrom = formData.get("accessFrom");
    const totalPropertyArea = formData.get("totalPropertyArea");

    console.log({
      otherId,
      accessFrom,
      totalPropertyArea,
    });

    if (
      typeof otherId !== "string" ||
      typeof accessFrom !== "string" ||
      typeof totalPropertyArea !== "string"
    ) {
      return {
        success: false,
        error: "Invalid Inputs",
      };
    }

    // update here.
    const other = await prismadb.other.findUnique({
      where: {
        id: Number(otherId),
      },
    });
    if (!other) {
      return {
        success: false,
        error: "Other not found",
      };
    }

    await prismadb.other.update({
      where: {
        id: Number(otherId),
      },
      data: {
        accessFrom: accessFrom,
        totalPropertyArea: Number(totalPropertyArea),
      },
    });
  }

  function featuresValue(value: string) {
    if (value === "yes") {
      return true;
    }
    if (value === "no") {
      return false;
    }
  }

  const updatedListing = (await prismadb.listing.findUnique({
    where: {
      id: Number(listingId),
    },
    include: {
      agency: true,
      user: true,
      commercial: true,
      residential: true,
      land: true,
      other: true,
      listingFeatures: {
        include: {
          feature: true,
        },
      },
    },
  })) as ListingWithRelations;

  return {
    success: true,
    data: {
      listing: updatedListing ? updatedListing : listing,
    },
  };
}
async function editFeatures(formData: FormData) {
  const listingId = formData.get("listingId");

  // Get all form data keys except the system ones
  const formDataKeys = Array.from(formData.keys()).filter(
    (key) => !["listingId", "step"].includes(key),
  );

  try {
    // Get the listing and its features in a single query
    const listing = await prismadb.listing.findUnique({
      where: {
        id: Number(listingId),
      },
      include: {
        listingFeatures: {
          include: {
            feature: true,
          },
        },
      },
    });

    // Create sets for efficient lookup
    const existingFeatureKeys = new Set(
      listing!.listingFeatures.map((lf) => lf.feature.key),
    );
    const newFeatureKeys = new Set(formDataKeys);

    // First, validate that all new feature keys actually exist in the database
    const validFeatures = await prismadb.feature.findMany({
      where: {
        key: {
          in: [...newFeatureKeys],
        },
        isActive: true,
      },
      select: {
        id: true,
        key: true,
      },
    });

    // Create a set of valid feature keys
    const validFeatureKeys = new Set(validFeatures.map((f) => f.key));

    // Filter out any invalid keys from our newFeatureKeys
    const invalidKeys = [...newFeatureKeys].filter(
      (key) => !validFeatureKeys.has(key),
    );
    if (invalidKeys.length > 0) {
      console.warn(
        `Attempted to add non-existent features: ${invalidKeys.join(", ")}`,
      );
    }

    // Calculate features to add and remove using only valid keys
    const featuresToAdd = [...newFeatureKeys].filter(
      (key) => !existingFeatureKeys.has(key) && validFeatureKeys.has(key),
    );
    const featuresToRemove = [...existingFeatureKeys].filter(
      (key) => !newFeatureKeys.has(key),
    );

    // Perform database operations in a transaction
    await prismadb.$transaction(async (tx) => {
      // Remove unchecked features
      if (featuresToRemove.length > 0) {
        await tx.listingFeature.deleteMany({
          where: {
            listingId: Number(listingId),
            feature: {
              key: {
                in: featuresToRemove,
              },
            },
          },
        });
      }

      // Add new features (we know these are valid because we filtered them)
      if (featuresToAdd.length > 0) {
        await tx.listingFeature.createMany({
          data: validFeatures
            .filter((f) => featuresToAdd.includes(f.key))
            .map((feature) => ({
              listingId: Number(listingId),
              featureId: feature.id,
            })),
        });
      }
    });

    // Fetch updated listing with all relations
    const updatedListing = await prismadb.listing.findUnique({
      where: {
        id: Number(listingId),
      },
      include: listingWithRelationsInclude,
    });

    return {
      success: true,
      data: {
        listing: updatedListing as ListingWithRelations,
      },
    };
  } catch (error) {
    console.error("Error updating features:", error);
    return {
      success: false,
      error: "Failed to update features",
    };
  }
}
async function editDescription(formData: FormData) {
  const enDescription = formData.get("enDescription");
  const mkDescription = formData.get("mkDescription");
  const alDescription = formData.get("alDescription");
  const enTitle = formData.get("enTitle");
  const mkTitle = formData.get("mkTitle");
  const alTitle = formData.get("alTitle");
  console.log("editing description", {
    enDescription,
    mkDescription,
    alDescription,
    enTitle,
    mkTitle,
    alTitle,
  });
  console.log("editing description", {
    enDescription: typeof enDescription !== "string",
    mkDescription: typeof mkDescription !== "string",
    alDescription: typeof alDescription !== "string",
    enTitle: typeof enTitle !== "string",
    mkTitle: typeof mkTitle !== "string",
    alTitle: typeof alTitle !== "string",
  });
  if (
    typeof enDescription !== "string" ||
    typeof mkDescription !== "string" ||
    typeof alDescription !== "string" ||
    typeof enTitle !== "string" ||
    typeof mkTitle !== "string" ||
    typeof alTitle !== "string"
  ) {
    return {
      success: false,
      error: "Invalid Inputs",
    };
  }

  const listingId = formData.get("listingId")! as string;

  console.log("editing description", {
    enDescription,
    mkDescription,
    alDescription,
    enTitle,
    mkTitle,
    alTitle,
  });
  await prismadb.listing.update({
    where: {
      id: Number(listingId),
    },
    data: {
      enDescription,
      mkDescription,
      alDescription,
      enTitle,
      mkTitle,
      alTitle,
    },
  });
  console.log("updated listing");
  const updatedListing = (await prismadb.listing.findUnique({
    where: {
      id: Number(listingId),
    },
    include: {
      agency: true,
      user: true,
      commercial: true,
      residential: true,
      land: true,
      other: true,
      listingFeatures: {
        include: {
          feature: true,
        },
      },
    },
  })) as ListingWithRelations;
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
  const images = formData.get("images"); // stringified array of UploadedImageData

  if (typeof videoLink !== "string" || typeof images !== "string") {
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

  const parsedImages = images ? JSON.parse(images) : [];
  await prismadb.listing.update({
    where: {
      id: Number(listingId),
    },
    data: {
      videoLink,
      images: parsedImages,
      mainImage: parsedImages[0] ?? {},
    },
  });

  const updatedListing = (await prismadb.listing.findUnique({
    where: {
      id: Number(listingId),
    },
    include: {
      agency: true,
      user: true,
      commercial: true,
      residential: true,
      land: true,
      other: true,
      listingFeatures: {
        include: {
          feature: true,
        },
      },
    },
  })) as ListingWithRelations;
  return {
    success: true,
    data: {
      listing: updatedListing,
    },
  };
}
async function editContactDetails(formData: FormData) {
  // this is skipped
  // const firstName = formData.get("firstName");
  // const lastName = formData.get("lastName");
  // const email = formData.get("email");
  // const phone = formData.get("phone");
  // const contactHours = formData.get("contactHours");
  // if (
  //   typeof firstName !== "string" ||
  //   typeof lastName !== "string" ||
  //   typeof email !== "string" ||
  //   typeof phone !== "string" ||
  //   typeof contactHours !== "string"
  // ) {
  //   return {
  //     success: false,
  //     error: "Invalid Inputs",
  //   };
  // }
  const listingId = formData.get("listingId")! as string;
  // const listing = await prismadb.listing.findUnique({
  //   where: {
  //     id: Number(listingId),
  //   },
  // });
  // if (!listing) {
  //   return {
  //     success: false,
  //     error: "Listing not found",
  //   };
  // }
  // await prismadb.listing.update({
  //   where: {
  //     id: Number(listingId),
  //   },
  //   data: {},
  // });
  const updatedListing = (await prismadb.listing.findUnique({
    where: {
      id: Number(listingId),
    },
    include: {
      agency: true,
      user: true,
      commercial: true,
      residential: true,
      land: true,
      other: true,
      listingFeatures: {
        include: {
          feature: true,
        },
      },
    },
  })) as ListingWithRelations;
  return {
    success: true,
    data: {
      listing: updatedListing,
    },
  };
}

async function editPayment(formData: FormData) {
  const listingId = formData.get("listingId")! as string;

  let requestProfessionalPromotion = formData.get(
    "requestProfessionalPromotion",
  );

  requestProfessionalPromotion = requestProfessionalPromotion ? "on" : "off";

  if (requestProfessionalPromotion === "on") {
    const pp = await prismadb.professionalPromotion.findFirst({
      where: {
        listingId: Number(listingId),
      },
    });
    if (!pp) {
      await prismadb.professionalPromotion.create({
        data: {
          listingId: Number(listingId),
        },
      });
    }
  }

  if (requestProfessionalPromotion === "off") {
    const pp = await prismadb.professionalPromotion.findFirst({
      where: {
        listingId: Number(listingId),
      },
    });
    if (pp) {
      await prismadb.professionalPromotion.delete({
        where: {
          id: pp.id,
        },
      });
    }
  }
  const updatedListing = (await prismadb.listing.findUnique({
    where: {
      id: Number(listingId),
    },
    include: {
      agency: true,
      user: true,
      commercial: true,
      residential: true,
      land: true,
      other: true,
      professionalPromotion: true,
      listingFeatures: {
        include: {
          feature: true,
        },
      },
    },
  })) as ListingWithRelations;

  return {
    success: true,
    data: {
      listing: updatedListing,
    },
  };
}
async function editPublishing(formData: FormData) {
  const isPublished = formData.get("isPublished");
  const listingId = formData.get("listingId")! as string;

  if (typeof isPublished !== "string" || !listingId) {
    return {
      success: false,
      error: "Invalid Inputs",
    };
  }

  // Get current listing to check completeness
  const currentListing = await prismadb.listing.findUnique({
    where: { id: Number(listingId) },
  });

  if (!currentListing) {
    return { success: false, error: "Listing not found" };
  }

  const makePublished = isPublished === "yes" ? true : false;
  // Check if listing is complete
  const isComplete = checkListingCompleteness(currentListing);

  let newStatus = currentListing.status;
  let newSubstatus = currentListing.substatus;

  const monthsFromNow = new Date();
  monthsFromNow.setMonth(monthsFromNow.getMonth() + 6);

  const weTrustCreators = true;
  const isTrusted = currentListing.userId ? weTrustCreators : true;

  if (makePublished) {
    if (!isComplete) {
      newStatus = ListingStatus.DRAFT;
      newSubstatus = "";
    } else {
      // MVP Fast-Track: Skip PENDING_REVIEW, go straight to RISKY_ACTIVE
      newStatus = ListingStatus.ACTIVE;
      newSubstatus = isTrusted ? "" : "requires_review_new";
    }
  } else {
    if (currentListing.status === ListingStatus.ACTIVE) {
      newStatus = ListingStatus.INACTIVE;
      newSubstatus = "user_hidden";
    } else {
      newStatus = ListingStatus.DRAFT;
      newSubstatus = "";
    }
  }

  const updatedListing = (await prismadb.listing.update({
    where: {
      id: Number(listingId),
    },
    data: {
      isPublished: makePublished,
      publishedAt: makePublished ? new Date() : null,
      publishEndDate: makePublished ? monthsFromNow : null,
      status: newStatus,
      substatus: newSubstatus,
      queryHash: "NEW_QUERY_HASH_CALCULATED_HERE",
    },
    include: {
      agency: true,
      user: true,
      commercial: true,
      residential: true,
      land: true,
      other: true,
      listingFeatures: {
        include: {
          feature: true,
        },
      },
    },
  })) as ListingWithRelations;

  console.log("newStatus for Listing", newStatus);
  if (newStatus === ListingStatus.ACTIVE) {
    // we dont wait for this to finish, because it is not critical
    console.log("Notifying concerned users about new listing");
    notifyConcernedUsersAboutNewListing(updatedListing);
    console.log("Generating static listing page for ", listingId);
    // generateStaticListingPage(Number(updatedListing.listingNumber));
  }

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
  const { account, user, agency } = await getCurrentUser();
  if (!account) {
    return {
      error: "Unauthorized",
      success: false,
    };
  }

  // console.log("Editing listing", formData);

  const step = formData.get("step");

  if (typeof step !== "string" || Number(step) < 0 || Number(step) > 9) {
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
  const listing = await prismadb.listing.findFirst({
    where: {
      id: Number(listingId),
    },
  });

  if (!listing) {
    return {
      error: "Listing not found",
      success: false,
    };
  }

  if (user && listing.userId !== user?.id) {
    return {
      error: "Unauthorized",
      success: false,
    };
  }
  if (agency && listing.agencyId !== agency?.id) {
    return {
      error: "Unauthorized",
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
      output = await editPayment(formData);
      break;
    case 9:
      output = await editPublishing(formData);
      break;
    default:
      break;
  }

  // we dont wait for this to finish, because it is not critical
  // console.log("Revalidating listing page for ", listingId);
  revalidateListingPage(Number(listing.listingNumber));
  return output;
}

export default async function getAllListings(
  parsedParams: Record<string, any>,
): Promise<Listing[]> {
  const pp = parsedParams as ParsedQueryParams;
  // console.log("API CALL");
  // console.log("pp", pp);

  let municipalities: string[] = [];
  let places: string[] = [];

  if (pp.location) {
    if (Array.isArray(pp.location)) {
      municipalities = pp.location.filter((l) => l.startsWith("1"));

      places = pp.location.filter((l) => l.startsWith("2"));
    } else {
      municipalities = pp.location.startsWith("1") ? [pp.location] : [];
      places = pp.location.startsWith("2") ? [pp.location] : [];
    }
  }

  // console.log("municipalities", municipalities);
  // console.log("places", places);

  const listings = await prismadb.listing.findMany({
    where: {
      AND: [
        {
          OR: [
            municipalities.length > 0
              ? {
                  municipality: {
                    in: municipalities,
                  },
                }
              : {},
            places.length > 0
              ? {
                  place: {
                    in: places,
                  },
                }
              : {},
          ],
        },
        {
          isPublished: true,
          isAvailable: true,
          status: ListingStatus.ACTIVE,
          area: {
            gte: pp.areaLow ? Number(pp.areaLow) : undefined,
            lte: pp.areaHigh ? Number(pp.areaHigh) : undefined,
          },
          price: {
            gte: pp.priceLow ? Number(pp.priceLow) : undefined,
            lte: pp.priceHigh ? Number(pp.priceHigh) : undefined,
          },
          category: pp.category as PropertyCategory,
          type: pp.type as PropertyType,
          transactionType: pp.transactionType as PropertyTransactionType,
        },
      ],
      // MAIN FILTERS
    },
    include: {
      agency: {
        select: {
          slug: true,
          logo: true,
          name: true,
        },
      },
      user: {
        select: {
          contactName: true,
          pictureUrl: true,
        },
      },
    },
    // take: 20,
  });
  // console.log({ ll2: listings.length });
  const uniqueAgencyIds = new Set(listings.map((listing) => listing.agencyId));
  const uniqueListings = listings
    .filter(
      (listing) =>
        uniqueAgencyIds.has(listing.agencyId) &&
        uniqueAgencyIds.delete(listing.agencyId),
    )
    .map((l) => l.agencyId);
  // console.log({ uniqueListings });
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
  //   ...listing, ...(pp.l ? { location: { contains: pp.l } } : {}),
  //   isFavorited: favoritedListingIds.has(listing.id),
  // }));

  // // Now `listingsWithFavoriteInfo` contains all listings with `isFavorited` marked for the current user
  // return listingsWithFavoriteInfo;

  // console.log("returned listings ; ", listings.length);
  return listings;
}

export async function getListingViews(listingId: number) {
  const views = await prismadb.listingView.findMany({
    where: {
      listingId,
    },
  });
  return views;
}

export type RegisterListingViewData = {
  headersList: Headers;
  locale: string;
};

export async function registerListingView(
  listingId: number,
  data: RegisterListingViewData,
) {
  const { account } = await getCurrentUser();

  let ip =
    data.headersList.get("x-forwarded-for") ||
    data.headersList.get("remote-addr") ||
    data.headersList.get("x-real-ip") ||
    "unknown";
  // Normalize IP address
  let ipAddress = ip;

  // Handle multiple IPs (x-forwarded-for can return comma-separated IPs)
  ipAddress = ipAddress.split(",")[0].trim();

  // Handle invalid/empty IPs
  if (ipAddress === "::1" || ipAddress === "") {
    ipAddress = "127.0.0.1";
  }

  if (ipAddress === "unknown") {
    ipAddress = "";
  }
  // If no way to identify viewer (no IP and no account), skip
  if (!ipAddress && !account) {
    return;
  }

  const timeDifferenceInMinutes = 1;
  const dateInPast = new Date(Date.now() - 60 * 1000 * timeDifferenceInMinutes);

  // Check for recent view from same account/IP

  const recentView = await prismadb.listingView.findFirst({
    where: {
      listingId,
      OR: [
        ...(account ? [{ accountId: account.id }] : []),
        ...(ipAddress ? [{ ipAddress }] : []),
      ],
      viewedAt: {
        gte: dateInPast,
      },
    },
    orderBy: {
      viewedAt: "desc",
    },
  });

  // If recent view exists, don't create new view or update count
  if (recentView) {
    return;
  }
  const ipInfoResponse = await fetch(`http://ip-api.com/json/${ipAddress}`);
  const ipInfo = await ipInfoResponse.json();

  const userAgent = data.headersList.get("user-agent") || "";
  const parser = new UAParser(userAgent);
  const deviceInfo: IResult = parser.getResult();
  // console.log("userAgent", userAgent);
  // console.log("deviceInfo", deviceInfo);
  // console.log("deviceInfo", typeof deviceInfo);

  const otherInfo = {
    userAgent,
  };
  // Create new view record
  await prismadb.listingView.create({
    data: {
      listingId,
      accountId: account ? account.id : null,
      locale: data.locale,
      ipAddress,
      ipInfo: ipInfo.status === "success" ? ipInfo : null,
      deviceInfo: JSON.parse(JSON.stringify(deviceInfo)),
    },
  });

  // Update view count only after successful view creation
  await prismadb.listingViewCount.upsert({
    where: {
      listingId,
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      listingId,
      count: 1,
    },
  });
}

export type ParsedListingData = {
  area: number;
  price: number;
  mkTitle: string;
  mkDescription: string;
  externalRef: string;
  images: UploadedImageData[];
  mainImage: UploadedImageData;
  transactionType: PropertyTransactionType;
  category: PropertyCategory;
  type: PropertyType;
  municipality: string | null;
  place: string | null;
  address: string;
  latitude: number;
  longitude: number;
  rooms: number;
};

function figureOutListing(
  listingToProcess: ExternalListingData,
): ParsedListingData {
  //
  // let a: ExternalListingData = {
  //   url: "https://www.pazar3.mk/oglas/zivealista/stanovi/izdavanje/skopje/skopje-opstina/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate/2825258",
  //   mkTitle: "Nov dvosoben 56m2 kaj hotel Kontinental-East Gate",
  //   price: "370",
  //   address:
  //     "Džon Kenedi, Топаана, Chair, Skopje, Municipality of Chair, City of Skopje, 1009, North Macedonia",
  //   mkDescription:
  //     "Sifra> 23711\n\nSe izdava NOV kompletno namesten dvosoben 56m2 na 1- vi kat vo novite zgradi kaj hotel Kontinental - East Gate, edna spalna, terasa, juzna orientacija, stanot e ureden so nov mebel i vednas vseliv !\n2 parking mesta!\nCena: 370 evra\n\nKontakt:\n077 705 108\n075 534 820\n02 3051 300\nAgencija Doma Dom\nwww.domadom.mk\ninfo@domadom.mk\nstanovi Skopje-Avtokomanda/\nстанови Скопје-Автокоманда\nОпис на линк\nReal estate DOMA DOM\nАгенцијата за недвижности Real Estate DOMA DOM е доверлива агенција за недвижности во Скопје, Македонија, која е посветена на помагање на своите клиенти во наоѓање на совршениот дом или инвестициска можност. Со долгогодишно искуство во областа на недвижности, Агенцијата за недвижности DOMA DOM Ви нуди широк избор на недвижности - куќи, станови, викендички, и деловни простори, како и други имоти ширум Македонија.\n\nКако агенција на која може да и верувате, Real Estate DOMA DOM поседува тим од професионалци кои се секогаш подготвени да Ви помогнат во секој чекор од процесот, било да сте во потрага по нов стан, куќа или имот за инвестиција. Секој клиент добива индивидуален пристап и целосна поддршка со цел постигнување на најдоброто можно решение при купување, издавање или продажба на куќи и станови.\n\nПонудата на недвижности вклучува различни типови на имоти во сите делови на Скопје и пошироко, така што без разлика дали барате нов дом или деловен простор, Real Estate DOMA DOM е тука за Вас. Преку Агенцијата за недвижности DOMA DOM, можете да ги пронајдете најдобрите недвижности кои ќе ги исполнат Вашите потреби и очекувања.\n\nДоверете се на агенција со искуство, професионализам и квалитетна услуга во областа на недвижности. (stanovi vo Skopje, Centar, Karpos,Taftalidze)\n\nОвластен агент за MoneyGram -money transfer,\nПосети ја страната на нашата продавница\nstr.Mitropolit Teodosij Gologanov nb.72b lok.18 Прикажи на мапата\n00389023051300\nhttps://www.domadom.mk",
  //   images: [
  //     "https://media.pazar3.mk/Image/61202d00626b465b9a1f0ec1fb617a1d/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
  //     "https://media.pazar3.mk/Image/70fcb75f0cd14c5dbb083bba78560d52/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
  //     "https://media.pazar3.mk/Image/7d2ef8563fdb4c6693091cae3bcba9f3/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
  //     "https://media.pazar3.mk/Image/31113f30da5d4db9bd98504ba507ae22/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
  //     "https://media.pazar3.mk/Image/ee8130012e6549c382513f054637d00a/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
  //     "https://media.pazar3.mk/Image/207fdb8d8e4b48f58378f9d854954d5d/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
  //     "https://media.pazar3.mk/Image/708be54be21f4aa6be4d5cd907889f4d/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
  //   ],
  //   mainImage:
  //     "https://media.pazar3.mk/Image/61202d00626b465b9a1f0ec1fb617a1d/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
  //   externalRef: "Sifra&gt; 23711",
  //   externalRefCleared: "23711",
  //   publishedAtDate: "фев. 21 2025",
  //   publishedAtTime: "02:15",
  //   tagTransactionType: "N/A",
  //   tagAddressData: "Avtokomanda -East Gate",
  //   tagRooms: "2",
  //   tagArea: "56 m2",
  //   tagLocation: "Скопје, Скопjе",
  //   tags: [
  //     {
  //       label: "Број на соби:",
  //       value: "2",
  //     },
  //     {
  //       label: "Состојба:",
  //       value: "Ново",
  //     },
  //     {
  //       label: "Адреса:",
  //       value: "Avtokomanda -East Gate",
  //     },
  //     {
  //       label: "Површина:",
  //       value: "56 m2",
  //     },
  //     {
  //       label: "За живеалиштето:",
  //       value:
  //         "Балкон / Тераса, Лифт, Паркинг простор / Гаража, Нова градба, Наместен, Интерфон",
  //     },
  //     {
  //       label: "Вид на оглас:",
  //       value: "Се изнајмува",
  //     },
  //     {
  //       label: "Огласено од:",
  //       value: "Продавница",
  //     },
  //     {
  //       label: "Локација:",
  //       value: "Скопје, Скопjе",
  //     },
  //   ],
  //   coordinates: "21.439862 42.013463",
  //   addressData:
  //     "Džon Kenedi, Топаана, Chair, Skopje, Municipality of Chair, City of Skopje, 1009, North Macedonia",
  //   lastBreadcrumb: "https://www.pazar3.mk/oglasi/zivealista/stanovi",
  // };
  let a = listingToProcess;
  const breadcrumb = a.lastBreadcrumb.split("/");
  const importantString = breadcrumb[breadcrumb.length - 1];

  const listing: ParsedListingData = {
    area: Number(a.tagArea.split(" ")[0]),
    price: a.price === "missing" ? 0 : Number(a.price),
    externalRef: a.mkDescription.includes("ШИФРА")
      ? a.mkDescription.split("ШИФРА ")[1]?.split(" ")[0]
      : "",
    images: a.images,
    mainImage: a.mainImage,
    transactionType: tryGetTransactionType(a.tags),
    category: categoryMatcher[
      importantString as keyof typeof categoryMatcher
    ] as PropertyCategory,
    type: typeMatcher[
      importantString as keyof typeof typeMatcher
    ] as PropertyType,
    municipality: tryMatchMunicipality(a.tags),
    place: tryMatchPlace(a.tags),
    address:
      a.tags.find((tag) => tag.label === "Адреса:")?.value +
      ", " +
      a.addressData,
    latitude: Number(parseFloat(a.coordinates.split(" ")[1]).toFixed(6)),
    longitude: Number(parseFloat(a.coordinates.split(" ")[0]).toFixed(6)),
    mkTitle: a.mkTitle,
    mkDescription: a.mkDescription,
    rooms: Number(a.tagRooms.match(/\d+/)?.[0] || 0),
  };
  return listing;
}

const tryMatchMunicipality = (tags: { label: string; value: string }[]) => {
  const addressTag = tags.find((tag) => tag.label === "Локација:");
  const address = addressTag ? addressTag.value : null;
  console.log("address", address);
  const municipality = address
    ? municipalityMatcher[address as keyof typeof municipalityMatcher]
    : null;
  return municipality || null;
};

const tryGetTransactionType = (tags: { label: string; value: string }[]) => {
  const transactionTypeTag = tags.find((tag) => tag.label === "Вид на оглас:");
  const transactionType = transactionTypeTag
    ? transactionTypeTag.value === "Се изнајмува"
      ? "rent"
      : "sale"
    : "sale";
  return transactionType as PropertyTransactionType;
};

const tryMatchPlace = (tags: { label: string; value: string }[]) => {
  const addressTag = tags.find((tag) => tag.label === "Адреса:");
  const address = addressTag ? addressTag.value : null;
  const place = address
    ? placeMatcher[address as keyof typeof placeMatcher]
    : null;
  return place || null;
};

function mapTagsToFeatureKeys(
  tags: { label: string; value: string }[],
): string[] {
  console.log("tags called");
  const zTags = tags.find((tag) => tag.label === "За живеалиштето:");
  const zTagsValues = zTags ? zTags.value.split(",").map((f) => f.trim()) : [];
  const sTags = tags.find((tag) => tag.label === "Состојба:");
  const sTagsValues = sTags ? sTags.value.split(",").map((f) => f.trim()) : [];
  const allFeatures = [...zTagsValues, ...sTagsValues].filter(
    (f) => f !== undefined,
  );
  if (!allFeatures) return [];

  const featureKeys = allFeatures.map(
    (f) => tagsMatcher[f as keyof typeof tagsMatcher],
  );
  console.log("tags created into features", featureKeys);

  return featureKeys;
}

export async function createListingsFromWebhook(
  listingsToProcessRaw: ExternalListingData[],
  clientSlug: string,
) {
  console.log("Starting webhook process with:", {
    listingsCount: listingsToProcessRaw.length,
    clientSlug,
  });

  const allFeatures = await prismadb.feature.findMany({
    where: {
      isActive: true,
    },
  });
  try {
    const agency = await prismadb.agency.findUnique({
      where: { slug: clientSlug },
      select: { id: true },
    });

    if (!agency) {
      console.log("Agency not found:", clientSlug);
      return {
        success: false,
        error: `Agency not found with slug: ${clientSlug}`,
      };
    }

    console.log("Processing listings for agency:", agency.id);
    const createdListings: Listing[] = [];

    for (const ld of listingsToProcessRaw) {
      console.log("Processing listing:", {
        title: ld.mkTitle,
        ref: ld.externalRef,
      });

      try {
        const l = figureOutListing(ld);
        const aaa = l;
        // @ts-ignore
        // delete aaa.images;
        // @ts-ignore
        // delete aaa.mainImage;
        console.log("Figured out listing data:", aaa);

        const lData: Partial<Listing> = {
          uuid: crypto.randomUUID(),
          externalRef: l.externalRef,
          agencyId: agency.id,
          transactionType: l.transactionType,
          category: l.category,
          type: l.type,
          municipality: l.municipality,
          place: l.place,
          address: l.address,
          fullAddress: l.address
            ? `${l.municipality}, ${l.place}, ${l.address}`
            : "",
          locationPrecision: "exact",
          mkTitle: l.mkTitle,
          mkDescription: l.mkDescription,
          price: l.price,
          area: l.area,
          images: l.images || [],
          mainImage: l.mainImage,
          status: ListingStatus.ACTIVE,
          listingNumber: l.latitude,
          longitude: l.longitude,
          substatus: "autogenerated",
          isPublished: true,
          publishedAt: new Date(),
          publishEndDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6), // 6 months
        };

        const listingsToCreate = [];
        const listing = await prismadb.listing.create({
          data: {
            uuid: crypto.randomUUID(),
            externalRef: l.externalRef,
            agencyId: agency.id,
            transactionType: l.transactionType,
            category: l.category,
            type: l.type,
            municipality: l.municipality,
            place: l.place,
            address: l.address,
            fullAddress: l.address
              ? `${l.municipality}, ${l.place}, ${l.address}`
              : "",
            locationPrecision: "exact",
            mkTitle: l.mkTitle,
            mkDescription: l.mkDescription,
            price: l.price,
            area: l.area,
            images: l.images || [],
            mainImage: l.mainImage,
            status: ListingStatus.ACTIVE,
            longitude: l.longitude,
            latitude: l.latitude,
            substatus: "autogenerated",
            isPublished: true,
            publishedAt: new Date(),
            publishEndDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6), // 6 months
            ...(l.category === "residential"
              ? {
                  residential: {
                    create: {
                      propertyType: l.type as ResidentalPropertyType,
                      bathroomCount: 1,
                      kitchenCount: 1,
                      livingRoomCount: 1,
                      bedroomCount: Math.max(0, l.rooms - 1),
                      // You might want to make this a parameter
                    },
                  },
                  commercial: undefined,
                  land: undefined,
                  other: undefined,
                }
              : l.category === "commercial"
                ? {
                    residential: undefined,
                    commercial: {
                      create: {
                        wcCount: 1,
                        propertyType: l.type as CommercialPropertyType,
                      },
                    },
                    land: undefined,
                    other: undefined,
                  }
                : l.category === "land"
                  ? {
                      residential: undefined,
                      commercial: undefined,
                      land: {
                        create: {
                          propertyType: l.type as LandPropertyType,
                        },
                      },
                      other: undefined,
                    }
                  : {
                      residential: undefined,
                      commercial: undefined,
                      land: undefined,
                      other: {
                        create: {
                          propertyType: l.type as OtherPropertyType,
                          // Other type doesn't require many fields
                        },
                      },
                    }),
          },
        });

        const foundTags = mapTagsToFeatureKeys(ld.tags);
        console.log({ foundTags });
        const features = allFeatures.filter((f) => {
          console.log(f.key);
          if (foundTags.includes(f.key)) {
            return true;
          }
          return false;
        });

        console.log({ features });
        console.log(ld.tags);

        const fmap = features.map((f) => ({
          listingId: listing.id,
          featureId: f.id,
        }));
        console.log("fmap", fmap, listing.id, listing.listingNumber);
        const listingFeatures = await prismadb.listingFeature.createMany({
          data: fmap,
        });

        console.log("listingFeatures", listingFeatures);

        // console.log("Successfully created listing:", listing.id);
        // listing.then((l) => {
        //   createdListings.push(l);
        //   generateStaticListingPage(l.listingNumber);
        // });
        createdListings.push(listing);
        generateStaticListingPage(listing.listingNumber);
      } catch (error) {
        let errorDetails = {
          title: ld.mkTitle,
          externalRef: ld.externalRef,
          errorType: "Unknown Error",
          errorMessage: "An unknown error occurred",
        };

        // Type guard for Error objects
        if (error instanceof Error) {
          errorDetails = {
            ...errorDetails,
            errorType: error.name,
            errorMessage: error.message,
          };
          console.log("errorDetails", errorDetails);
          // Type guard for Prisma errors
          const prismaError = error as PrismaClientValidationError;
          if (prismaError) {
            console.log("prismaError", prismaError);
          }
        }

        // Log the detailed error
        console.error("Failed to create listing:", {
          ...errorDetails,
          timestamp: new Date().toISOString(),
          stackTrace: error instanceof Error ? error.stack : undefined,
        });

        continue; // Continue with next listing
      }
    }

    console.log("Finished processing all listings:", createdListings.length);
    return {
      success: true,
      data: {
        listings: createdListings,
      },
    };
  } catch (error) {
    console.error("Top-level error in createListingsFromWebhook:", error);
    // return {
    //   success: false,
    //   error: "Failed to create listings",
    //   details: error,
    // };
  }
}
