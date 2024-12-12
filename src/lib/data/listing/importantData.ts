import {
  FeatureCategory,
  LocationPrecision,
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
    PropertyType.other,
  ],
  commercial: [
    PropertyType.office,
    PropertyType.store,
    PropertyType.warehouse,
    PropertyType.industrial_space,
    PropertyType.other,
  ],
  land: [
    PropertyType.construction,
    PropertyType.agricultural,
    PropertyType.other,
  ],
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

export const locationPrecisionOptions = Object.values(LocationPrecision);

export const featuresCategories = Object.values(FeatureCategory);

export const features: Record<FeatureCategory, string[]> = {
  INTERNAL: ["wifi", "ac", "elevator", "alart", "protectionDoor", "spajz"],
  EXTERNAL: ["garage"],
  UTILITIES: [],
  ROOMS: ["bedroom", "living", "wcs", "kitchen", "bathroom"],
  RESIDENTAL_OTHER: [],
  OTHER: [],
};

export const zoneOptions = [
  "residential",
  "commercial",
  "agricultural",
  "industrial",
  "recreational",
  "unincorporated",
];
export const heatingTypeOptions = [
  "autonomous",
  "central",
  "air_condition",
  "none",
];

export const heatingMediumOptions = [
  "oil",
  "natural_gas",
  "diesel",
  "electricity",
  "wood",
  "solar",
  "geothermal",
  "heat_pump",
];

export const accessFromOptions = [
  "paved",
  "asphalt",
  "pedestrian",
  "dirt_road",
  "sea",
  "other",
  "no_road_access",
];

export const slopeOptions = ["flat", "inclined", "steep"];
