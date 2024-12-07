import {
  FeatureCategory,
  PropertyCategory,
  PropertyTransactionType,
  PropertyType,
} from "@prisma/client";

export const listingTransactionTypeOptions = Object.values(
  PropertyTransactionType,
);

export const listingCategoryOptions = Object.values(PropertyCategory);

export const listingTypeOptions: Record<PropertyCategory, PropertyType[]> = {
  residential: [
    PropertyType.apartment,
    PropertyType.house,
    PropertyType.vacation_house,
  ],
  commercial: [
    PropertyType.office,
    PropertyType.store,
    PropertyType.warehouse,
    PropertyType.industrial_space,
  ],
  land: [PropertyType.construction, PropertyType.agricultural],
  other: [
    PropertyType.garage,
    PropertyType.business,
    PropertyType.assembly_facilities,
    PropertyType.other,
  ],
};

export const orientationOptions = [
  "north",
  "south",
  "east",
  "west",
  "north-east",
  "north-west",
  "south-east",
  "south-west",
];

export const locationPrecisionOptions = ["exact", "approximate", "wide"];

export const featuresCategories = Object.values(FeatureCategory);
export const features: Record<FeatureCategory, string[]> = {
  INTERNAL: ["wifi", "ac", "elevator", "alart", "protectionDoor", "spajz"],
  EXTERNAL: ["garage"],
  UTILITIES: [],
  ROOMS: ["bedroom", "living", "wcs", "kitchen", "bathroom"],
  OTHER: [],
};
