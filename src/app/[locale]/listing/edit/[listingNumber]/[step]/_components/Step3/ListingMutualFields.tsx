"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Euro, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn, displayPrice } from "@/lib/utils";
import { Listing } from "@prisma/client";
import { useState } from "react";
import { ListingWithRelations } from "@/types/listing.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface ListingMutualFieldsProps {
  listing: Listing;
}
export default function ListingMutualFields({
  listing,
}: ListingMutualFieldsProps) {
  const t = useTranslations();
  const [propertyArea, setPropertyArea] = useState(
    listing.area?.toString() ?? "",
  );
  const [propertyPrice, setPropertyPrice] = useState(
    listing.price?.toString() ?? "",
  );
  const [propertyPricePerSquare, setPropertyPricePerSquare] = useState(
    listing.price && listing.area
      ? (listing.price / listing.area).toFixed(2)
      : "",
  );
  const [isPricePerAgreement, setIsPricePerAgreement] = useState(
    listing.price === 0,
  );
  const lwr = listing as ListingWithRelations;

  const updatePriceAndPricePerSquare = (area: string, price: string) => {
    const areaNum = Number(area);
    const priceNum = Number(price);

    if (areaNum && priceNum) {
      const pricePerSquare = priceNum / areaNum;
      setPropertyPricePerSquare(pricePerSquare.toFixed(2));
    } else {
      setPropertyPricePerSquare("");
    }
  };

  const updatePriceFromPricePerSquare = (
    area: string,
    pricePerSquare: string,
  ) => {
    const areaNum = Number(area);
    const pricePerSquareNum = Number(pricePerSquare);

    if (areaNum && pricePerSquareNum) {
      const totalPrice = areaNum * pricePerSquareNum;
      setPropertyPrice(totalPrice.toString());
    } else {
      setPropertyPrice("");
    }
  };

  return (
    <>
      {/* ExternalRef for agencies only */}
      {lwr.agency && (
        <div className="flex flex-col gap-3">
          <Label htmlFor="externalRef">
            {t(
              "listing.new.progress.steps.mainCharacteristics.externalRef.label",
            )}
          </Label>
          <Input
            id="externalRef"
            name="externalRef"
            defaultValue={lwr.externalRef ?? ""}
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.externalRef.placeholder",
            )}
          />
        </div>
      )}
      {/* Area */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="area" className="inline-flex items-center">
          {t("listing.new.progress.steps.mainCharacteristics.area.label")}
          <span className="text-red-500">*</span>
          <Popover>
            <PopoverTrigger>
              <Info className="ml-1 h-4 w-4" />
            </PopoverTrigger>
            <PopoverContent>
              <p className="max-w-[300px] p-2 text-xs">
                {t(
                  "listing.new.progress.steps.mainCharacteristics.area.description",
                )}
              </p>
            </PopoverContent>
          </Popover>
        </Label>
        <div className="relative mb-2 flex min-w-[300px] items-center">
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
            max={10000}
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.area.placeholder",
            )}
            value={propertyArea}
            onChange={(e) => {
              const newArea = e.target.value.replace(/[^0-9]/g, "");
              const limitedArea = Number(newArea) > 3000 ? "3000" : newArea;
              setPropertyArea(limitedArea);

              if (propertyPrice) {
                updatePriceAndPricePerSquare(limitedArea, propertyPrice);
              } else if (propertyPricePerSquare) {
                updatePriceFromPricePerSquare(
                  limitedArea,
                  propertyPricePerSquare,
                );
              }
            }}
          />
        </div>
      </div>
      {/* Price Per Agreement Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="pricePerAgreement"
          name="pricePerAgreement"
          checked={isPricePerAgreement}
          onCheckedChange={(checked) => {
            setIsPricePerAgreement(checked === true);
            if (checked) {
              setPropertyPrice("0");
              setPropertyPricePerSquare("");
            }
          }}
        />
        <Label htmlFor="pricePerAgreement">
          {t(
            "listing.new.progress.steps.mainCharacteristics.pricePerAgreement",
          )}
        </Label>
      </div>
      {/* Price field */}
      <div
        className={cn(
          "inline-flex w-full flex-col gap-3",
          isPricePerAgreement && "hidden",
        )}
      >
        <Label htmlFor="price">
          {t("listing.new.progress.steps.mainCharacteristics.price.label")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative mb-2 flex min-w-[300px] items-center">
          <div className="absolute left-1 mr-2 w-5 font-semibold">
            <Euro className="h-4 w-4" />
          </div>
          <Input
            required
            className={"pl-6"}
            name="price"
            id="price"
            disabled={isPricePerAgreement}
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.price.placeholder",
            )}
            value={propertyPrice}
            onChange={(e) => {
              if (!isPricePerAgreement) {
                const newPrice = e.target.value.replace(/[^0-9]/g, "");
                setPropertyPrice(newPrice);

                if (propertyArea) {
                  updatePriceAndPricePerSquare(propertyArea, newPrice);
                }
              }
            }}
          />
        </div>
      </div>
      {/* Price per square meter */}
      <div
        className={cn(
          "inline-flex w-full flex-col gap-3",
          isPricePerAgreement && "hidden",
          listing.transactionType === "rent" && "hidden",
        )}
      >
        <Label htmlFor="pricePerSquare">
          {t(
            "listing.new.progress.steps.mainCharacteristics.pricePerSquare.label",
          )}
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative mb-2 flex min-w-[300px] items-center">
          <div className="absolute left-1 mr-2 w-5 font-semibold">
            <Euro className="h-4 w-4" />
          </div>
          <Input
            required
            className="pl-6"
            name="pricePerSquare"
            id="pricePerSquare"
            disabled={isPricePerAgreement}
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.pricePerSquare.placeholder",
            )}
            value={propertyPricePerSquare}
            onChange={(e) => {
              if (!isPricePerAgreement) {
                const newPricePerSquare = e.target.value.replace(/[^0-9]/g, "");
                setPropertyPricePerSquare(newPricePerSquare);

                if (propertyArea) {
                  updatePriceFromPricePerSquare(
                    propertyArea,
                    newPricePerSquare,
                  );
                }
              }
            }}
          />
        </div>
      </div>
    </>
  );
}
