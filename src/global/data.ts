export const UserRoles = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  AGENCY: "AGENCY",
  SUPPORT: "SUPPORT",
};

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
  commercial: [
    "office",
    "store",
    "warehouse",
    "industrial space",
    "other",
  ],
  land: ["construction", "agricultural", "other"],
  other: [
    "garage",
    "business",
    "assembly facilities", // montazni objekti
    "other",
  ],
};
