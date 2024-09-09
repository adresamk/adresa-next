import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
} from "nuqs/server"; // Note: import from 'nuqs/server' to avoid the "use client" directive
export const secondaryFiltersParsers = {
  floorNumberLow: parseAsString.withDefault(""),
  floorNumberHigh: parseAsString.withDefault(""),
  bedroomsNumberLow: parseAsString.withDefault(""),
  bedroomsNumberHigh: parseAsString.withDefault(""),
  constructionYearLow: parseAsString.withDefault(""),
  constructionYearHigh: parseAsString.withDefault(""),
  isNewDevelopment: parseAsBoolean.withDefault(false),
  heatingType: parseAsString.withDefault(""),
  isFurnitureIncluded: parseAsBoolean.withDefault(false),
  externalFeatures: parseAsArrayOf(parseAsString, ",").withDefault([
    "ac",
  ]),
  internalFeatures: parseAsArrayOf(parseAsString, ",").withDefault(
    []
  ),
  lastUpdated: parseAsString.withDefault(""),
  creationDate: parseAsString.withDefault(""),
};

export const allFiltersParsers = {
  mode: parseAsString.withDefault("buy"),
  location: parseAsString.withDefault(""),
  priceLow: parseAsString.withDefault(""),
  priceHigh: parseAsString.withDefault(""),
  propertyType: parseAsString.withDefault(""),
  subType: parseAsString.withDefault(""),
  areaLow: parseAsString.withDefault(""),
  areaHigh: parseAsString.withDefault(""),
  ...secondaryFiltersParsers,
};

export const searchParamsCache =
  createSearchParamsCache(allFiltersParsers);
