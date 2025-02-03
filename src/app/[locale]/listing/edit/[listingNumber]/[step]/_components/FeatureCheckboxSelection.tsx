import { Checkbox } from "@/components/ui/checkbox";
import { Feature, ListingFeature } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

interface FeatureCheckboxSelectionProps {
  feature: Feature;
  listingFeatures: ListingFeature[];
}
export default function FeatureCheckboxSelection({
  feature,
  listingFeatures,
}: FeatureCheckboxSelectionProps) {
  const t = useTranslations();
  const listingFeatureExists = listingFeatures.find(
    (listingFeature) => listingFeature.featureId === feature.id,
  );
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={feature.key}
        defaultChecked={!!listingFeatureExists}
        name={feature.key}
        value="1"
      />
      <label
        htmlFor={feature.key}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {t(`common.property.feature.keys.${feature.key}`)}
      </label>
    </div>
  );
}
