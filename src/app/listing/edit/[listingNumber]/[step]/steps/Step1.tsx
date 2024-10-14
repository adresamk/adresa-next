"use client";
import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Listing } from "@prisma/client";
import { listingTypeOptions } from "@/global/data";
const propertyCategoryOptions = [
  "residential",
  "commercial",
  "land",
  "other",
];

type PropertyCategory = (typeof propertyCategoryOptions)[number];

export default function Step1({ listing }: { listing: Listing }) {
  const [propertyCategory, setPropertyCategory] =
    useState("apartment");
  return (
    <div className="p-2">
      <input
        type="string"
        className="hidden"
        defaultValue="1"
        name="step"
      />
      <h2 className="text-lg">Basic information</h2>
      <Separator className="my-2 mt-4" />

      <RadioGroupDemo
        name="type"
        defaultValue={listing.type}
        title="Property Type"
        values={listingTypeOptions[listing.category]}
      />
    </div>
  );
}
