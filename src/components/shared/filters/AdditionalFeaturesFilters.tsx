import { FeatureCategory } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { Feature } from "@prisma/client";
import { useEffect, useState } from "react";
import FeatureShowcase from "@/app/[locale]/listing/[listingNumber]/_components/FeatureShowcase";
import { useTranslations } from "next-intl";
import { featureIcons } from "@/lib/data/listing/importantDataReact";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdditionalFeaturesFiltersProps {
  setSelectedFeaturesKeys: (keys: string[]) => void;
  selectedFeaturesKeys: string[];
  features: Feature[];
  isLoading: boolean;
}
export default function AdditionalFeaturesFilters({
  selectedFeaturesKeys,
  setSelectedFeaturesKeys,
  features,
  isLoading,
}: AdditionalFeaturesFiltersProps) {
  const t = useTranslations();

  const featuresByCategory = features.reduce(
    (acc, feature) => {
      acc[feature.category] = [...(acc[feature.category] || []), feature];
      return acc;
    },
    {} as Record<FeatureCategory, Feature[]>,
  );
  //effect description

  function handleFeatureClick(key: string) {
    const newSelectedFeaturesKeys = selectedFeaturesKeys.includes(key)
      ? selectedFeaturesKeys.filter((k) => k !== key)
      : [...selectedFeaturesKeys, key];
    setSelectedFeaturesKeys(newSelectedFeaturesKeys);
  }

  return (
    <div className="relative flex min-h-96 flex-col gap-3">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      )}
      <div>
        {Object.keys(featuresByCategory).map((category) => {
          return (
            <div key={category}>
              <div className="my-3 flex items-center gap-3 overflow-x-hidden">
                <span className="inline-flex w-fit text-nowrap">
                  {t(`common.property.feature.category.${category}`)}
                </span>
                <Separator />
              </div>
              <div className="flex items-center gap-3 px-2">
                {/* Add Other features */}
                <div className="flex flex-wrap gap-2">
                  {featuresByCategory[category as FeatureCategory].map((f) => (
                    <div
                      key={`${category}-${f.key}`}
                      onClick={() => handleFeatureClick(f.key)}
                      className={cn(
                        "flex cursor-pointer select-none items-center gap-2 rounded-sm border border-slate-500 px-1.5 py-0.5 text-sm text-slate-700",
                        selectedFeaturesKeys.includes(f.key) &&
                          "bg-primary text-white",
                      )}
                    >
                      {featureIcons.hasOwnProperty(f.key) &&
                        featureIcons[f.key as keyof typeof featureIcons]}
                      {t(`common.property.feature.keys.${f.key}`)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
