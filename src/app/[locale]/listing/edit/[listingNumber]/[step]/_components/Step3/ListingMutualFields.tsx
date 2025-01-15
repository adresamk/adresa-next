"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Euro } from "lucide-react";
import { useTranslations } from "next-intl";
import { displayPrice } from "@/lib/utils";
import { Listing } from "@prisma/client";
import { useState } from "react";
import { ListingWithRelations } from "@/types/listing.types";

interface ListingMutualFieldsProps {
  listing: Listing;
}
export default function ListingMutualFields({
  listing,
}: ListingMutualFieldsProps) {
  const t = useTranslations();
  const [propertyPrice, setPropertyPrice] = useState(
    listing.price ? displayPrice(listing.price) : "",
  );
  const [propertyArea, setPropertyArea] = useState(listing.area?.toString());
  const lwr = listing as ListingWithRelations;
  return (
    <>
      {/* Price */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="price">
          {t("listing.new.progress.steps.mainCharacteristics.price")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative mb-2 flex w-1/2 min-w-[300px] items-center">
          <div className="absolute left-1 mr-2 w-5 font-semibold">
            <Euro className="h-4 w-4" />
          </div>
          <Input
            required
            className="pl-6"
            name="price"
            id="price"
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.pricePlaceholder",
            )}
            value={propertyPrice.replace("$", "").replace("€", "")}
            onChange={(e) => {
              // With Ai tell the code to make a splitter for number, comma after 3 digits

              // setPropertyPrice(e.target.value);
              const newValue = e.target.value.replace(/[^0-9]/g, "");
              const formattedValue = displayPrice(Number(newValue))
                .replace("$", "")
                .replace("€", "");
              setPropertyPrice(formattedValue);
            }}
          />
        </div>
      </div>
      {/* Area */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="area">
          {t("listing.new.progress.steps.mainCharacteristics.area")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative mb-2 flex w-1/2 min-w-[300px] items-center">
          <div className="absolute left-1 mr-2 w-5 text-sm font-semibold">
            m<sup>2</sup>
          </div>
          <Input
            required
            type="number"
            name="area"
            className="pl-7"
            id="area"
            min={1}
            max={3000}
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.areaPlaceholder",
            )}
            value={propertyArea || 1}
            onChange={(e) => {
              let newValue = e.target.value.replace(/[^0-9]/g, "");
              if (Number(newValue) > 3000) {
                newValue = "3000";
              }
              setPropertyArea(newValue);
            }}
          />
        </div>
      </div>

      {/* ExternalRef for agencies only */}
      {lwr.agency && (
        <div className="flex flex-col gap-3">
          <Label htmlFor="externalRef">
            {t("listing.new.progress.steps.mainCharacteristics.externalRef")}
          </Label>
          <Input
            id="externalRef"
            name="externalRef"
            defaultValue={lwr.externalRef ?? ""}
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.externalRefPlaceholder",
            )}
          />
        </div>
      )}
    </>
  );
}
