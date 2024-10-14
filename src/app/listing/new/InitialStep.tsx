"use client";
import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { Separator } from "@/components/ui/separator";
import {
  listingCategoryOptions,
  listingTypeOptions,
} from "@/global/data";
import { useState } from "react";

// const propertyCategoryOptions = [
//   "residential",
//   "commercial",
//   "land",
//   "other",
// ];

// type PropertyCategory = (typeof propertyCategoryOptions)[number];

// const propertyTypeOptions: Record<PropertyCategory, string[]> = {
//   residential: [
//     "apartment",
//     "studio flat",
//     "maisonette",
//     "detached house",
//     "villa",
//     "loft",
//     "bungalow",
//     "building",
//     "apartment complex",
//     "farm",
//     "houseboat",
//     "other categories",
//   ],
//   commercial: [
//     "office",
//     "store",
//     "warehouse",
//     "industrial space",
//     "craft space",
//     "hotel",
//     "business building",
//     "showroom",
//     "other categories",
//   ],
//   land: ["land plot", "parcel", "island", "other categories"],
//   other: [
//     "garage",
//     "business",
//     "prefabricated",
//     "detachable",
//     "air",
//     "other categories",
//   ],
// };

// THESE HERE ARE VALUES FOR ADRESA.MK

const transactionTypeOptions = ["sale", "rent"];
export default function InitialStep() {
  const [listingCategory, setListingCategory] = useState("");
  return (
    <div className="p-2">
      <input
        type="string"
        className="hidden"
        defaultValue="0"
        name="step"
      />
      <h2 className="text-lg">Basic information</h2>
      <Separator className="my-2 mt-4" />

      <RadioGroupDemo
        name="category"
        title="Property Category"
        description="(can't be changed later!)"
        values={listingCategoryOptions}
        onChange={function (value: string) {
          console.log(value);
          setListingCategory(value);
        }}
      />

      <RadioGroupDemo
        name="type"
        title="Property Type"
        values={listingTypeOptions[listingCategory]}
      />

      <RadioGroupDemo
        name="transactionType"
        title="Available for"
        description="(can't be changed later!)"
        values={transactionTypeOptions}
      />
    </div>
  );
}
