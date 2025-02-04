"server-only";
import { getRegionsMunicipalitiesIds } from "@/lib/data/macedonia/importantData";
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

export async function getAllListingsByBoundingBox(
  parsedParams: Record<string, any>,
  parsedSearchParams: Record<string, any>,
): Promise<Listing[]> {
  const pp = parsedParams as ParsedQueryParams;
  // console.log("API CALL");
  // console.log("pp", pp);

  // pp.location should exist and should be === "ms"

  const boundingBox = {
    NELat: Number(parsedSearchParams.NELat),
    NELng: Number(parsedSearchParams.NELng),
    SWLat: Number(parsedSearchParams.SWLat),
    SWLng: Number(parsedSearchParams.SWLng),
  };
  console.log("boundingBox", boundingBox);
  const listings = await prismadb.listing.findMany({
    where: {
      latitude: {
        gte: boundingBox.SWLat,
        lte: boundingBox.NELat,
      },
      longitude: {
        gte: boundingBox.SWLng,
        lte: boundingBox.NELng,
      },
      isPublished: true,
      isAvailable: true,
      status: ListingStatus.ACTIVE,

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
    orderBy: {
      price:
        pp.sorting === "low_price"
          ? "asc"
          : pp.sorting === "high_price"
            ? "desc"
            : undefined,
      createdAt: pp.sorting === "new" ? "desc" : undefined,
    },
  });
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

export async function getAllListings(
  parsedParams: Record<string, any>,
): Promise<Listing[]> {
  const pp = parsedParams as ParsedQueryParams;
  console.log("API CALL");
  // console.log("pp", pp);

  let municipalities: string[] = [];
  let places: string[] = [];
  let regions: string[] = [];
  // console.log("pp.location", pp.location);
  if (pp.location) {
    if (Array.isArray(pp.location)) {
      municipalities = pp.location.filter((l) => l.startsWith("1"));
      places = pp.location.filter((l) => l.startsWith("2"));
      regions = pp.location.filter((l) => l.startsWith("0"));
    } else {
      municipalities = pp.location.startsWith("1") ? [pp.location] : [];
      places = pp.location.startsWith("2") ? [pp.location] : [];
      regions = pp.location.startsWith("0") ? [pp.location] : [];
    }
  }

  const regionMunicipalities =
    regions.length > 0
      ? regions
          .map((r) => {
            return getRegionsMunicipalitiesIds(r);
          })
          .flat()
      : [];

  // console.log({ regionMunicipalities });
  // console.log("municipalities", municipalities);
  // console.log("places", places);
  const listings = await prismadb.listing.findMany({
    where: {
      AND: [
        {
          OR: [
            regions.length > 0
              ? {
                  municipality: {
                    in: [...regionMunicipalities],
                  },
                }
              : {},
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
    },
    include: {
      listingFeatures: {
        include: {
          feature: {
            select: {
              key: true,
            },
          },
        },
      },
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
    orderBy: {
      price:
        pp.sorting === "low_price"
          ? "asc"
          : pp.sorting === "high_price"
            ? "desc"
            : undefined,
      createdAt: pp.sorting === "new" ? "desc" : undefined,
    },
  });
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
