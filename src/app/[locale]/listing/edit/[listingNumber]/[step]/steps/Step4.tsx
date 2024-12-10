import { Feature, Listing } from "@prisma/client";
import ResidentialAdditionalFeatures from "../_components/Step3/ResidentialAdditionalFeatures";
import CommercialAdditionalFeatures from "../_components/Step3/CommercialAdditionalFeatures";
import LandAdditionalFeatures from "../_components/Step3/LandAdditionalFeatures";
import OtherAdditionalFeatures from "../_components/Step3/OtherAdditionalFeatures";
import { useTranslations } from "next-intl";
import { ListingWithRelations } from "@/types/listing.types";
import { Separator } from "@/components/ui/separator";

export default function Step4({
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
    residential: lwr.residential!,
    commercial: lwr.commercial!,
    land: lwr.land!,
    other: lwr.other!,
  };
  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="4" name="step" />

      <h2 className="text-lg">
        {t("listing.new.progress.steps.mainCharacteristics.title")}
      </h2>
      <Separator className="my-2 mt-4" />

      {listing.residential && (
        <>
          <ResidentialAdditionalFeatures
            listing={basicTypedListing}
            allFeatures={allFeatures}
          />
        </>
      )}
      {listing.commercial && (
        <>
          <CommercialAdditionalFeatures
            listing={basicTypedListing}
            allFeatures={allFeatures}
          />
        </>
      )}
      {listing.land && (
        <>
          <LandAdditionalFeatures
            listing={basicTypedListing}
            allFeatures={allFeatures}
          />
        </>
      )}
      {listing.other && (
        <>
          <OtherAdditionalFeatures
            listing={basicTypedListing}
            allFeatures={allFeatures}
          />
        </>
      )}
    </div>
  );
}
