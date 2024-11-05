"use server";

import { validateRequest } from "@/lib/auth";
import prismadb from "@/lib/db";
import { ListingWithOwnerAndAgency } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export async function createListing() {
  const { user, session } = await validateRequest();
  if (!session) {
    redirect("/signin?redirect=/listing/new");
  } else {
    redirect("/listing/new");
  }
}

export async function addListingAsFavorite(listingId: string) {
  const { user } = await validateRequest();

  if (!user) {
    return {
      status: 401,
      success: false,
      error: "Unauthorized",
    };
  }
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

export async function removeListingAsFavorite(listingId: string) {
  const { user } = await validateRequest();

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
  const { user } = await validateRequest();

  if (!user) {
    redirect("/");
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
  console.log(formData);
  const listingId = formData.get("listingId")?.valueOf();

  if (typeof listingId !== "string" || !listingId) {
    return {
      success: false,
      error: "Listing ID necessary",
    };
  }

  const { user, session } = await validateRequest();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  await prismadb.listing.delete({
    where: {
      id: listingId,
    },
  });

  revalidatePath("/profile/listings");
  return {
    success: true,
    error: false,
  };
}

export async function adjustListingVisibility(formData: FormData) {
  console.log(formData);
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
  const { user, session } = await validateRequest();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const wasVisible = isVisible === "true";
  await prismadb.listing.update({
    where: {
      id: listingId,
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

export async function getListing(listingNumber: string) {
  try {
    const listing = (await prismadb.listing.findUnique({
      where: {
        listingNumber: Number(listingNumber),
      },
      include: {
        owner: {
          select: {
            agency: true,
          },
        },
      },
    })) as ListingWithOwnerAndAgency;

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

export async function getFavoriteStatus(listingId: string) {
  const { user } = await validateRequest();
  if (!user) return false;

  const favorite = await prismadb.favorite.findFirst({
    where: {
      listingId,
      userId: user.id,
    },
  });

  return !!favorite;
}
