import { Prisma } from "@prisma/client";

// User with basic relations
export const userWithBasicInclude = {
  account: true,
  favorites: true,
} as const;

// User with listings
export const userWithListingsInclude = {
  ...userWithBasicInclude,
  listings: true,
} as const;

// User with full relations
export const userWithFullInclude = {
  account: true,
  favorites: {
    include: {
      listing: true,
    },
  },
  listings: {
    include: {
      listingFeatures: {
        include: {
          feature: true,
        },
      },
    },
  },
  savedSearches: true,
} as const;

// Types for each include combination
export type UserWithBasic = Prisma.UserGetPayload<{
  include: typeof userWithBasicInclude;
}>;

export type UserWithListings = Prisma.UserGetPayload<{
  include: typeof userWithListingsInclude;
}>;

export type UserWithFull = Prisma.UserGetPayload<{
  include: typeof userWithFullInclude;
}>;

// Helper function for type-safe includes
export function createUserInclude<T extends Prisma.UserInclude>(
  include: T,
) {
  return include;
}

// Helper function to pick specific includes
export function pickUserIncludes<K extends keyof typeof userWithBasicInclude>(
  keys: K[],
) {
  return Object.fromEntries(
    keys.map((key) => [key, userWithBasicInclude[key]]),
  ) as Pick<typeof userWithBasicInclude, K>;
}
