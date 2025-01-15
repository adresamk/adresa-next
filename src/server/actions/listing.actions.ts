"use server";

import prismadb from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
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
  ListingWithRelations,
  listingWithRelationsInclude,
  UploadedImageData,
} from "@/types/listing.types";
import { ParsedQueryParams } from "@/lib/filters";

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

export async function addListingAsFavorite(listingId: number) {
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

  if (!isAuthenticated) {
    // const cookieStore = await cookies();
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
        value: 10000,
      },
    });
  }

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
      listingNumber: listingNumber.value + 1,
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
      longitude: Number(longitude),
      latitude: Number(latitude),
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

  const price = formData.get("price");
  const area = formData.get("area");
  const externalRef = formData.get("externalRef");
  console.log("externalRef", externalRef);
  if (
    typeof price !== "string" ||
    typeof area !== "string"
    // typeof externalRef !== "string"
  ) {
    return {
      success: false,
      error: "Invalid Inputs",
    };
  }
  const priceCleaned = price.replace(".", "").replace(" ", "").replace(",", "");
  await prismadb.listing.update({
    where: {
      id: Number(listingId),
    },
    data: {
      price: Number(priceCleaned),
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

async function handleProfessionalPromotion(
  listingId: number,
  requestProfessionalPromotion: "on" | "off",
) {
  if (requestProfessionalPromotion === "on") {
    const pp = await prismadb.professionalPromotion.findFirst({
      where: {
        listingId: listingId,
      },
    });
    if (pp) {
      return;
    }
    await prismadb.professionalPromotion.create({
      data: {
        listingId: listingId,
      },
    });
  }

  if (requestProfessionalPromotion === "off") {
    const pp = await prismadb.professionalPromotion.findFirst({
      where: {
        listingId: listingId,
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
}
async function editPublishing(formData: FormData) {
  const isPublished = formData.get("isPublished");

  if (typeof isPublished !== "string") {
    return {
      success: false,
      error: "Invalid Inputs",
    };
  }

  let requestProfessionalPromotion = formData.get(
    "requestProfessionalPromotion",
  );

  const listingId = formData.get("listingId")! as string;
  requestProfessionalPromotion = requestProfessionalPromotion ? "on" : "off";
  await handleProfessionalPromotion(
    Number(listingId),
    requestProfessionalPromotion as "on" | "off",
  );

  const makePublished = isPublished === "yes" ? true : false;

  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  await prismadb.listing.update({
    where: {
      id: Number(listingId),
    },
    data: {
      isPublished: makePublished,
      publishedAt: makePublished ? new Date() : null,
      publishEndDate: makePublished ? oneMonthFromNow : null,
      status: makePublished ? ListingStatus.ACTIVE : ListingStatus.DRAFT,
      queryHash: "NEW_QUERY_HASH_CALCULATED_HERE",
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
      output = await editPublishing(formData);
      break;
    default:
      break;
  }
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
          isVisible: true,
          area: {
            gte: Number(pp.areaLow) || undefined,
            lte: Number(pp.areaHigh) || undefined,
          },
          price: {
            gte: Number(pp.priceLow) || undefined,
            lte: Number(pp.priceHigh) || undefined,
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
