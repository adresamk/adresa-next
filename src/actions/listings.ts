"use server";

import { listings } from "@/global/data";
import { validateRequest } from "@/lib/auth";
import prismadb from "@/lib/db";
import { error } from "console";
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
  const listings = likedListingsByUser.map(
    (favorite) => favorite.listing
  );

  return listings;
}
