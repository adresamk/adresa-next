import prismadb from "@/lib/db";
import { ApplicablePropertyCategory, ListingStatus } from "@prisma/client";

export async function getListingWithRelations(listingNumber: number) {
  return prismadb.listing.findUnique({
    where: {
      listingNumber: Number(listingNumber),
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
      favoritedBy: true,
      professionalPromotion: true,
    },
  });
}
export async function getStaticCategoryFeatures(category: string) {
  return prismadb.feature.findMany({
    where: {
      applicableTypes: {
        hasSome: [category as ApplicablePropertyCategory, "all"],
      },
    },
  });
}

export async function getFeaturedAgencies() {
  return prismadb.agency.findMany({
    take: 6,

    include: {
      listings: {
        where: {
          status: ListingStatus.ACTIVE,
          isPublished: true,
          isAvailable: true,
        },
        select: {
          id: true, // You can select any field, but we only need the count
        },
      },
    },
  });
}
export async function getFeaturedListings() {
  return prismadb.listing.findMany({
    take: 5,
    where: {
      isPaidPromo: true,
      isPublished: true,
      isAvailable: true,
      status: ListingStatus.ACTIVE,
    },
  });
}
