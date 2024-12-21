import {
  Listing,
  Agency,
  User,
  PropertyTransactionType,
  PropertyCategory,
  PropertyType,
} from "@prisma/client";

// export type ListingWithOwnerAndAgency = Listing & {
//   owner: {
//     agency: Agency;
//   };
// };

export type ListingWithUserAndAgency = Listing & {
  user: User;
  agency: Agency;
};
// Helper type that converts Date to string in an object
type DateFieldsToString<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
      ? string | null
      : T[K] extends object
        ? DateFieldsToString<T[K]>
        : T[K];
};

// Your serialized listing type that only changes Date fields to strings
export type SerializedListing = DateFieldsToString<ListingWithUserAndAgency>;
export type LocalStorageKeysOptions =
  | "recentlyViewedListings"
  | "recentSearches";

export interface RecentlyViewedListing {
  listingNumber: number;
  addedToRecentlyViewedDateTime: number;
}
export interface ListingContactData {
  firstName?: string;
  lastName?: string;
  email?: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified: boolean;
  contactHours?: string;
}
export interface SearchCriteria {
  listingType: string;
  category: string;
  priceLow: number;
  priceHigh: number;
  livingAreaHigh: number;
  areaIDs: number[];
  sortBy: string;
  sortOrder: string;
}

export interface SearchGeography {
  geographyId: number;
  slug: string;
  parent: number;
  parentSlug: string;
  name: string;
  fullName: string;
  titleName: string;
  metaName: string;
  level: number;
  root_id: number;
  ancestors: {
    id: number[];
  };
  latitude: number;
  longitude: number;
}

export interface RealEstateSearch {
  searchCriteria: SearchCriteria;
  searchGeographies: SearchGeography[];
  searchHash: string;
  savedSearchTitle: string;
  addedToRecentDateTime: number;
}

export interface FiltersObject {
  // primary
  transactionType: PropertyTransactionType;
  location: string;
  category: PropertyCategory | "";
  type: PropertyType | "";
  priceLow: string;
  priceHigh: string;
  areaLow: string;
  areaHigh: string;
  // secondary
}
export type PartialFiltersObject = Partial<FiltersObject>;
