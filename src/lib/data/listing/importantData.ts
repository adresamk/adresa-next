export const listingTransactionTypeOptions = ["sale", "rent"];
export const listingCategoryOptions = [
  "residential",
  "commercial",
  "land",
  "other",
];
type ListingCategory = (typeof listingCategoryOptions)[number];

export const listingTypeOptions: Record<ListingCategory, string[]> = {
  residential: ["apartment", "house", "vacation house", "other"],
  commercial: ["office", "store", "warehouse", "industrial space", "other"],
  land: ["construction", "agricultural", "other"],
  other: [
    "garage",
    "business",
    "assembly facilities", // montazni objekti
    "other",
  ],
};

export const orientationOptions: { label: string; value: string }[] = [
  { label: "North", value: "north" },
  { label: "South", value: "south" },
  { label: "East", value: "east" },
  { label: "West", value: "west" },
  { label: "North East", value: "north-east" },
  { label: "North West", value: "north-west" },
  { label: "South East", value: "south-east" },
  { label: "South West", value: "south-west" },
];
export const locationPrecisionOptions = ["exact", "approximate", "wide"];
