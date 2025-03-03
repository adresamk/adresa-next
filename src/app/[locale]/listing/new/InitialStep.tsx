"use client";

import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
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

  const listingCategoryOptionsTranslated = listingCategoryOptions.map(
    (option) => {
      return {
        label: t(`common.property.category.${option}`),
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
          label: t(`common.property.type.${option}`),
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
        title={t("common.property.category.title")}
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
        title={t("common.property.type.label")}
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
        title={t("listing.new.transactionType.label")}
        description={t("common.cannotBeChanged")}
        options={listingTransactionTypeOptionsTranslated}
        onChange={function (value: string) {
          // @ts-ignore
          window.setInitialListing &&
            // @ts-ignore
            window.setInitialListing("transactionType", value);
        }}
      />
      <Separator className="my-2 mt-4" />

      <div className="my-5 flex gap-2">
        <Checkbox id="terms" defaultChecked required name="terms" />
        <Label
          htmlFor="terms"
          className="max-w-[400px] text-sm leading-4 text-slate-700"
        >
          {t("listing.new.agreeToTerms")}

          <Link
            href="/terms-of-use"
            className="ml-2 text-brand-light-blue underline"
          >
            {t("footer.Terms of Use")}
          </Link>
        </Label>
      </div>

      <div className="my-5 flex gap-2">
        <Checkbox
          id="listingTerms"
          defaultChecked
          required
          name="listingTerms"
        />
        <Label
          htmlFor="listingTerms"
          className="max-w-[400px] text-sm leading-4 text-slate-700"
        >
          {t("listing.new.agreeToListingTerms")}

          <Link
            href="/terms-for-listings"
            className="ml-2 text-brand-light-blue underline"
          >
            {t("footer.Terms for Listings")}
          </Link>
        </Label>
      </div>

      <div className="my-5 flex gap-2">
        <Checkbox id="dataUsage" defaultChecked required name="dataUsage" />
        <Label
          htmlFor="dataUsage"
          className="max-w-[400px] text-sm leading-4 text-slate-700"
        >
          {t("listing.new.agreeToDataUsage")}

          <Link
            href="/privacy-policy"
            className="ml-2 text-brand-light-blue underline"
          >
            {t("footer.Policies")}
          </Link>
        </Label>
      </div>
    </div>
  );
}
