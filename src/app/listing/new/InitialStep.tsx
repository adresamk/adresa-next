"use client";
import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { Separator } from "@/components/ui/separator";
import {
  listingCategoryOptions,
  listingTransactionTypeOptions,
  listingTypeOptions,
} from "@/lib/data/listing/importantData";

import { useState } from "react";

export default function InitialStep() {
  const [listingCategory, setListingCategory] = useState("");
  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="0" name="step" />
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
        values={listingTransactionTypeOptions}
      />
    </div>
  );
}
