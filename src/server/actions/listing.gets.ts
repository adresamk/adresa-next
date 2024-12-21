"server-only";
import prismadb from "@/lib/db";
import { ParsedQueryParams } from "@/lib/filters";
import {
  Listing,
  PropertyType,
  ListingStatus,
  PropertyCategory,
  PropertyTransactionType,
} from "@prisma/client";
import { unstable_cache } from "next/cache";

export default async function getAllListings(
  parsedParams: Record<string, any>,
): Promise<Listing[]> {
  const pp = parsedParams as ParsedQueryParams;
  console.log("API CALL");
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
            gte: pp.areaLow,
            lte: pp.areaHigh,
          },
          price: {
            gte: pp.priceLow,
            lte: pp.priceHigh,
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