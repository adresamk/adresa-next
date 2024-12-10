"use client";

import { Separator } from "@/components/ui/separator";
import { Feature, Listing } from "@prisma/client";

import { useTranslations } from "next-intl";
import { ListingWithRelations } from "@/types/listing.types";
import ListingMutualFields from "../_components/Step3/ListingMutualFields";
import ResidentialSpecificFields from "../_components/Step3/ResidentialSpecificFields";
import ResidentialAdditionalFeatures from "../_components/Step3/ResidentialAdditionalFeatures";
import CommercialAdditionalFeatures from "../_components/Step3/CommercialAdditionalFeatures";
import CommercialSpecificFields from "../_components/Step3/CommercialSpecificFields";
import LandSpecificFields from "../_components/Step3/LandSpecificFields";
import LandAdditionalFeatures from "../_components/Step3/LandAdditionalFeatures";
import OtherSpecificFields from "../_components/Step3/OtherSpecificFields";
import OtherAdditionalFeatures from "../_components/Step3/OtherAdditionalFeatures";

export default function Step3({
  listing: basicTypedListing,
  allFeatures,
}: {
  listing: Listing;
  allFeatures: Feature[];
}) {
  const t = useTranslations();
  const lwr = basicTypedListing as ListingWithRelations;

  const listing = {
    ...lwr,
    floor: lwr.residential?.floor || lwr.commercial?.floor,
    totalFloors: lwr.residential?.totalFloors,
    orientation: lwr.residential?.orientation || lwr.land?.orientation,
    zone: lwr.residential?.zone || lwr.land?.zone,
    constructionYear:
      lwr.residential?.constructionYear || lwr.commercial?.constructionYear,
    totalPropertyArea:
      lwr.residential?.totalPropertyArea ||
      lwr.commercial?.totalPropertyArea ||
      lwr.other?.totalPropertyArea,
    isFurnished: lwr.residential?.isFurnished,
    isForStudents: lwr.residential?.isForStudents,
    isForHolidayHome: lwr.residential?.isForHolidayHome,
    commonExpenses:
      lwr.residential?.commonExpenses || lwr.commercial?.commonExpenses,
    heatingType: lwr.residential?.heatingType || lwr.commercial?.heatingType,
    heatingMedium:
      lwr.residential?.heatingMedium || lwr.commercial?.heatingMedium,
    isCornerProperty:
      lwr.commercial?.isCornerProperty || lwr.land?.isCornerProperty,
    isOnTopFloor: lwr.commercial?.isOnTopFloor,
    accessFrom:
      lwr.commercial?.accessFrom ||
      lwr.land?.accessFrom ||
      lwr.other?.accessFrom,
    slope: lwr.land?.slope,
    propertyType: lwr.land?.propertyType,
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
            allFeatures={allFeatures}
          />
        </>
      )}
      {listing.commercial && (
        <>
          <CommercialSpecificFields
            listing={basicTypedListing}
            allFeatures={allFeatures}
          />
        </>
      )}
      {listing.land && (
        <>
          <LandSpecificFields
            listing={basicTypedListing}
            allFeatures={allFeatures}
          />
        </>
      )}
      {listing.other && (
        <>
          <OtherSpecificFields
            listing={basicTypedListing}
            allFeatures={allFeatures}
          />
        </>
      )}
      {/* FEATURE THINGY */}
    </div>
  );
}
