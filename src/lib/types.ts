import { Listing, Agency } from "@prisma/client";

export type ListingWithOwnerAndAgency = Listing & {
  owner: {
    agency: Agency;
  };
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
export type SerializedListing = DateFieldsToString<ListingWithOwnerAndAgency>;
export type ListingWithRelations = Listing & {
  owner: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  favoritedBy: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  }[];
};
export interface ListingContactData {
  firstName?: string;
  lastName?: string;
  email?: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified: boolean;
  contactHours?: string;
}
export type propertyTypeValues =
  | "Apartment"
  | "House"
  | "Home"
  | "Land"
  | "Commercial"
  | "Industrial"
  | "Garage"
  | "Other";

export type modeOptions = "sale" | "rent";

export interface FiltersObject {
  // primary
  mode: modeOptions;
  location: string;
  propertyType: propertyTypeValues[number];
  subType: string;
  priceLow: string;
  priceHigh: string;
  areaLow: string;
  areaHigh: string;
  // secondary
  floorNumberLow: string;
  floorNumberHigh: string;
  bedroomsNumberLow: string;
  bedroomsNumberHigh: string;
  constructionYearLow: string;
  constructionYearHigh: string;
  isNewDevelopment: boolean;
  heatingType: string;
  isFurnitureIncluded: boolean;
  externalFeatures: string[];
  internalFeatures: string[];
  lastUpdated: string;
  creationDate: string;
}
export type PartialFiltersObject = Partial<FiltersObject>;
