"use client";

import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { Separator } from "@/components/ui/separator";
import {
  listingCategoryOptions,
  listingTransactionTypeOptions,
  listingTypeOptions,
} from "@/lib/data/listing/importantData";
import { PropertyCategory } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function InitialStep() {
  const t = useTranslations();
  const [listingCategory, setListingCategory] = useState("");

  // const listingCategoryOptions = notTranslatedListingCategoryOptions.map(
  //   (option) => t(`common.listing.categoryOptions.${option}`),
  // );
  const listingCategoryOptionsTranslated = listingCategoryOptions.map(
    (option) => {
      return {
        label: t(`common.listing.categoryOptions.${option}`),
        value: option,
      };
    },
  );

  const listingTransactionTypeOptionsTranslated =
    listingTransactionTypeOptions.map((option) => {
      return {
        label: t(`listing.transactionType.${option}`),
        value: option,
      };
    });

  const listingTypeOptionsTranslated = listingCategory
    ? listingTypeOptions[listingCategory as PropertyCategory].map((option) => {
        return {
          label: t(`listing.type.${option}`),
          value: option,
        };
      })
    : [];

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="0" name="step" />
      <h2 className="text-lg font-semibold text-brand-dark-blue">
        {t("listing.new.propertyDetails")}
      </h2>
      <Separator className="my-2 mt-4" />

      <RadioGroupDemo
        name="category"
        required
        title={t("listing.new.propertyType.label")}
        description={t("common.cannotBeChanged")}
        options={listingCategoryOptionsTranslated}
        onChange={function (value: string) {
          setListingCategory(value);
          // @ts-ignore
          window.setInitialListing &&
            // @ts-ignore
            window.setInitialListing("category", value);
        }}
      />

      <RadioGroupDemo
        name="type"
        required
        title={t("listing.new.propertyType.label")}
        options={listingTypeOptionsTranslated}
        onChange={function (value: string) {
          // @ts-ignore
          window.setInitialListing &&
            // @ts-ignore
            window.setInitialListing("type", value);
        }}
      />

      <RadioGroupDemo
        required
        name="transactionType"
        title={t("listing.new.listingType.label")}
        description={t("common.cannotBeChanged")}
        options={listingTransactionTypeOptionsTranslated}
        onChange={function (value: string) {
          // @ts-ignore
          window.setInitialListing &&
            // @ts-ignore
            window.setInitialListing("transactionType", value);
        }}
      />
    </div>
  );
}
