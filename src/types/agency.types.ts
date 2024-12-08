import { Prisma } from "@prisma/client";

// Agency with basic relations
export const agencyWithBasicInclude = {
  listings: {
    select: {
      id: true,
    },
  },
  users: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
} as const;

// Agency with full relations
export const agencyWithFullInclude = {
  listings: true,
  users: {
    include: {
      listings: true,
    },
  },
} as const;

// Agency with listings count
export const agencyWithListingsCountInclude = {
  listings: {
    select: {
      id: true,
    },
  },
} as const;

// Types for each include combination
export type AgencyWithBasic = Prisma.AgencyGetPayload<{
  include: typeof agencyWithBasicInclude;
}>;

export type AgencyWithFull = Prisma.AgencyGetPayload<{
  include: typeof agencyWithFullInclude;
}>;

export type AgencyWithListingsCount = Prisma.AgencyGetPayload<{
  include: typeof agencyWithListingsCountInclude;
}>;

// Helper function for type-safe includes
export function createAgencyInclude<T extends Prisma.AgencyInclude>(
  include: T,
) {
  return include;
}
