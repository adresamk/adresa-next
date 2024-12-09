"use client";
import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { Separator } from "@/components/ui/separator";
import { Listing, PropertyCategory } from "@prisma/client";
import { listingTypeOptions } from "@/lib/data/listing/importantData";
import { useTranslations } from "next-intl";

export default function Step1({ listing }: { listing: Listing }) {
  const t = useTranslations();
  const listingTypeOptionsTranslated = listing.category
    ? listingTypeOptions[listing.category].map((option) => {
        return {
          label: t(`listing.type.${option}`),
          value: option,
        };
      })
    : [];

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="1" name="step" />
      <h2 className="text-lg">
        {t("listing.new.progress.steps.propertyType.basicInformation")}
      </h2>
      <Separator className="my-2 mt-4" />

      <RadioGroupDemo
        name="type"
        defaultValue={listing.type}
        title={t("listing.new.propertyType.label")}
        options={listingTypeOptionsTranslated}
      />
    </div>
  );
}
