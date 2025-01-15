"use client";

import { Separator } from "@/components/ui/separator";
import { Feature, Listing } from "@prisma/client";

import { useTranslations } from "next-intl";
import { ListingWithRelations } from "@/types/listing.types";
import ListingMutualFields from "../_components/Step3/ListingMutualFields";
import ResidentialSpecificFields from "../_components/Step3/ResidentialSpecificFields";
import CommercialSpecificFields from "../_components/Step3/CommercialSpecificFields";
import LandSpecificFields from "../_components/Step3/LandSpecificFields";
import OtherSpecificFields from "../_components/Step3/OtherSpecificFields";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Step3({
  listing: basicTypedListing,
  allCategoryFeatures,
}: {
  listing: Listing;
  allCategoryFeatures: Feature[];
}) {
  const t = useTranslations();
  const lwr = basicTypedListing as ListingWithRelations;

  const listing = {
    ...lwr,
  };

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="3" name="step" />
      <input
        type="string"
        className="hidden"
        defaultValue={listing.category}
        name="listingCategory"
      />

      <h2 className="text-lg">
        {t("listing.new.progress.steps.mainCharacteristics.title")}
      </h2>
      <Separator className="my-2 mt-4" />

      <ListingMutualFields listing={basicTypedListing} />

      {listing.residential && (
        <>
          <ResidentialSpecificFields
            listing={basicTypedListing}
            allCategoryFeatures={allCategoryFeatures}
          />
        </>
      )}
      {listing.commercial && (
        <>
          <CommercialSpecificFields
            listing={basicTypedListing}
            allCategoryFeatures={allCategoryFeatures}
          />
        </>
      )}
      {listing.land && (
        <>
          <LandSpecificFields
            listing={basicTypedListing}
            allCategoryFeatures={allCategoryFeatures}
          />
        </>
      )}
      {listing.other && (
        <>
          <OtherSpecificFields
            listing={basicTypedListing}
            allCategoryFeatures={allCategoryFeatures}
          />
        </>
      )}
      {/* FEATURE THINGY */}
    </div>
  );
}
