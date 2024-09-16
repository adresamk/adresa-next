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
