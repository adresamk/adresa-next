"use client";
import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const propertyCategoryOptions = [
  "resitendial",
  "commercial",
  "land",
  "other",
];

type PropertyCategory = (typeof propertyCategoryOptions)[number];

const propertyTypeOptions: Record<PropertyCategory, string[]> = {
  residential: [
    "apartment",
    "studio flat",
    "maisonette",
    "detached house",
    "villa",
    "loft",
    "bungalow",
    "building",
    "apartment complex",
    "farm",
    "houseboat",
    "other categories",
  ],
  commercial: [
    "office",
    "store",
    "warehouse",
    "industrial space",
    "craft space",
    "hotel",
    "business building",
    "showroom",
    "other categories",
  ],
  land: ["land plot", "parcel", "island", "other categories"],
  other: [
    "garage",
    "business",
    "prefabricated",
    "detachable",
    "air",
    "other categories",
  ],
};
const transactionTypeOptions = ["sale", "rent"];
export default function Step1() {
  const [propertyCategory, setPropertyCategory] =
    useState("apartment");
  return (
    <div className="p-2">
      <input type="string" className="hidden" value="1" name="step" />
      <h2 className="text-lg">Basic information</h2>
      <Separator className="my-2 mt-4" />

      <RadioGroupDemo
        name="type"
        defaultValue="apartment"
        title="Property Type"
        values={propertyTypeOptions["residential"]}
        onChange={function (value: string) {
          // setPropertyCategory(value);
        }}
      />
    </div>
  );
}
