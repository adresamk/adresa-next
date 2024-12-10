import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { Label } from "@/components/ui/label";
import { ListingWithRelations } from "@/types/listing.types";
import {
  Feature,
  FeatureCategory,
  Listing,
  PropertyCategory,
} from "@prisma/client";
import { Building, DoorClosed, Fence, ParkingSquare } from "lucide-react";
import { useTranslations } from "next-intl";

interface ResidentialAdditionalFeaturesProps {
  listing: Listing;
  allFeatures: Feature[];
}

function featuresValues(value: boolean | null) {
  if (value === true) return "yes";
  if (value === false) return "no";
}

export default function ResidentialAdditionalFeatures({
  listing: basicTypedListing,
  allFeatures,
}: ResidentialAdditionalFeaturesProps) {
  const lwr = basicTypedListing as ListingWithRelations;
  const listing = {
    ...lwr,
    residential: lwr.residential!,
  };
  const t = useTranslations();
  const residentialOtherFeatures = allFeatures.filter(
    (feature) =>
      feature.category === FeatureCategory.RESIDENTAL_OTHER &&
      feature.applicableTypes.includes(PropertyCategory.residential),
  );
  const initialResidentialOtherFeaturesState: Record<string, boolean> = {};

  residentialOtherFeatures.forEach((rof) => {
    const matchingFeature = listing.listingFeatures.find(
      (lf) => lf.featureId === rof.id,
    );

    initialResidentialOtherFeaturesState[rof.key] = matchingFeature
      ? matchingFeature.value === "1"
      : false;
  });
  const otherFeatures = initialResidentialOtherFeaturesState;
  const extraFeaturesValues = ["yes", "no"].map((option) => ({
    label: t(`common.buttons.${option}`),
    value: option,
  }));
  return (
    <>
      {/* FEATURE THINGY */}
      <div className="flex flex-col gap-3">
        <Label>Other characteristics</Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] flex-col">
          {/* Parking */}
          <div className="flex items-center">
            <ParkingSquare />
            <RadioGroupDemo
              name="parking"
              direction="horisontal"
              defaultValue={featuresValues(otherFeatures.parking)}
              title="Parking"
              options={extraFeaturesValues}
            />
          </div>
          {/* Elevator */}
          <div className="flex items-center">
            <DoorClosed />
            <RadioGroupDemo
              name="elevator"
              direction="horisontal"
              title="Elevator"
              options={extraFeaturesValues}
              defaultValue={featuresValues(otherFeatures.elevator)}
            />
          </div>
          {/* Balcony */}
          <div className="flex items-center">
            <Fence />
            <RadioGroupDemo
              name="balcony"
              direction="horisontal"
              title="Balcony"
              options={extraFeaturesValues}
              defaultValue={featuresValues(otherFeatures.balcony)}
            />
          </div>
          {/* Yard */}
          <div className="flex items-center">
            <Fence />
            <RadioGroupDemo
              direction="horisontal"
              name="yard"
              title="Yard"
              options={extraFeaturesValues}
              defaultValue={featuresValues(otherFeatures.yard)}
            />
          </div>
          {/* Basement */}
          <div className="flex items-center">
            <Building />
            <RadioGroupDemo
              direction="horisontal"
              name="basement"
              title="Basement"
              options={extraFeaturesValues}
              defaultValue={featuresValues(otherFeatures.basement)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
