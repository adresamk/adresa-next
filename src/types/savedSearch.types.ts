import { Prisma } from "@prisma/client";

// SavedSearch with basic relations
export const savedSearchWithBasicInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
} as const;

// SavedSearch with full relations
export const savedSearchWithFullInclude = {
  user: true,
  searchParams: true,
} as const;

// Types for each include combination
export type SavedSearchWithBasic = Prisma.SavedSearchGetPayload<{
  include: typeof savedSearchWithBasicInclude;
}>;

export type SavedSearchWithFull = Prisma.SavedSearchGetPayload<{
  include: typeof savedSearchWithFullInclude;
}>;

// Helper function for type-safe includes
export function createSavedSearchInclude<T extends Prisma.SavedSearchInclude>(
  include: T,
) {
  return include;
}

// Helper function to pick specific includes
export function pickSavedSearchIncludes<K extends keyof typeof savedSearchWithBasicInclude>(
  keys: K[],
) {
  return Object.fromEntries(
    keys.map((key) => [key, savedSearchWithBasicInclude[key]]),
  ) as Pick<typeof savedSearchWithBasicInclude, K>;
}
