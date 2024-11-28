"use client";

import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { Separator } from "@/components/ui/separator";
import {
  listingCategoryOptions,
  listingTransactionTypeOptions,
  listingTypeOptions,
} from "@/lib/data/listing/importantData";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function InitialStep() {
  const t = useTranslations();
  const [listingCategory, setListingCategory] = useState("");

  // const listingCategoryOptions = notTranslatedListingCategoryOptions.map(
  //   (option) => t(`common.listing.categoryOptions.${option}`),
  // );

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="0" name="step" />
      <h2 className="text-lg font-semibold text-brand-dark-blue">
        {t("listing.new.propertyDetails")}
      </h2>
      <Separator className="my-2 mt-4" />

      <RadioGroupDemo
        name="category"
        title={t("listing.new.propertyType.label")}
        description={t("common.cannotBeChanged")}
        values={listingCategoryOptions}
        onChange={function (value: string) {
          setListingCategory(value);
        }}
      />

      <RadioGroupDemo
        name="type"
        title={t("listing.new.propertyType.label")}
        values={listingTypeOptions[listingCategory]}
      />

      <RadioGroupDemo
        name="transactionType"
        title={t("listing.new.listingType.label")}
        description={t("common.cannotBeChanged")}
        values={listingTransactionTypeOptions}
      />
    </div>
  );
}
