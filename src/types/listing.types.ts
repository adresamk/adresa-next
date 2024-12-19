import {
  Feature,
  ListingFeature,
  Listing,
  Other,
  Land,
  Agency,
  User,
  Prisma,
  Commercial,
  Residential,
  ListingViewCount,
} from "@prisma/client";

// Define the exact include type we're using
export const listingWithRelationsInclude = {
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
} as const;

export const listingWithFavoritedByInclude = {
  favoritedBy: true,
} as const;

// Get the type from Prisma using the include type
export type ListingWithRelations = Prisma.ListingGetPayload<{
  include: typeof listingWithRelationsInclude;
}>;

export type ListingWithFavoritedBy = Prisma.ListingGetPayload<{
  include: typeof listingWithFavoritedByInclude;
}>;

// export type ListingWithRelations = Listing & {
//   agency: Agency | null;
//   user: User | null;
//   commercial: Commercial | null;
//   residential: Residential | null;
//   land: Land | null;
//   other: Other | null;
//   listingFeatures: (ListingFeature & { feature: Feature })[];
// };

// If you need specific subsets of the relations, you can create more specific types
export type ListingWithFeatures = Prisma.ListingGetPayload<{
  include: {
    listingFeatures: {
      include: {
        feature: true;
      };
    };
  };
}>;

export type ListingWithViewCount = Listing & {
  viewCount: ListingViewCount | null;
};

export type ListingFeatureWithFeature = ListingFeature & {
  feature: Feature;
};

// Base includes that are commonly used together
export const listingBaseIncludes = {
  user: true,
  commercial: true,
  listingFeatures: {
    include: {
      feature: true,
    },
  },
} as const;

// Without agency
export const listingWithoutAgencyInclude = {
  ...listingBaseIncludes,
} as const;

// Only features
export const listingFeaturesOnlyInclude = {
  listingFeatures: {
    include: {
      feature: true,
    },
  },
} as const;

// Only agency
export const listingAgencyOnlyInclude = {
  agency: true,
} as const;

// Type for each include combination
export type ListingWithoutAgency = Prisma.ListingGetPayload<{
  include: typeof listingWithoutAgencyInclude;
}>;

export type ListingFeaturesOnly = Prisma.ListingGetPayload<{
  include: typeof listingFeaturesOnlyInclude;
}>;

export type ListingAgencyOnly = Prisma.ListingGetPayload<{
  include: typeof listingAgencyOnlyInclude;
}>;

// You can also create a builder function for type-safe includes
export function createListingInclude<T extends Prisma.ListingInclude>(
  include: T,
) {
  return include;
}

// Example usage of the builder:
export const listingWithAgencyInclude = createListingInclude({
  agency: true,
});

// Helper function to pick specific includes from the base includes
export function pickListingIncludes<K extends keyof typeof listingBaseIncludes>(
  keys: K[],
) {
  return Object.fromEntries(
    keys.map((key) => [key, listingBaseIncludes[key]]),
  ) as Pick<typeof listingBaseIncludes, K>;
}

export type UploadedImageData = {
  url: string;
  name: string;
  size: number;
  key: string;
  lastModified: number | undefined;
  appUrl: string;
  customId: string | null;
  type: string;
  fileHash: string;
};

export interface ListingDescriptions {
  enDescription: string;
  mkDescription: string;
  alDescription: string;
}
export interface ListingTitles {
  enTitle: string;
  mkTitle: string;
  alTitle: string;
}
