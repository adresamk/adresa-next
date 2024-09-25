import { Product } from "../../types/types";
import { Listing } from "@prisma/client";
import products from "../../data/products.json";
import prismadb from "@/lib/db";
import { validateRequest } from "@/lib/auth";

export default async function getAllListings(
  search: string = ""
): Promise<Listing[]> {
  console.log("this is the search on the server", search);

  const { user } = await validateRequest();

  const listings = await prismadb.listing.findMany({
    where: {
      isPublished: true,
    },
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

  console.log("returned listings ; ", listings.length);
  return listings;
}
