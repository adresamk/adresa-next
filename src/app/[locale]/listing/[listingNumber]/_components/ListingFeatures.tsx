import { Separator } from "@/components/ui/separator";
import {
  ListingFeatureWithFeature,
  ListingWithRelations,
} from "@/types/listing.types";
import { Feature, FeatureCategory, Listing } from "@prisma/client";
import { useTranslations } from "next-intl";
import { features } from "process";
import FeatureShowcase from "./FeatureShowcase";

interface ListingFeaturesProps {
  listing: Listing;
}
export default function ListingFeatures({ listing }: ListingFeaturesProps) {
  const t = useTranslations();
  const lwr = listing as ListingWithRelations;
  const lfs = lwr.listingFeatures as ListingFeatureWithFeature[];

  const featuresByCategory = lfs
    .map((lf) => lf.feature)
    .filter(
      (f) =>
        f.applicableTypes.includes(listing.category) ||
        f.applicableTypes.includes("all"),
    )
    .reduce(
      (acc, feature) => {
        acc[feature.category as FeatureCategory] =
          acc[feature.category as FeatureCategory] || [];
        acc[feature.category as FeatureCategory].push(feature);
        return acc;
      },
      {} as Record<FeatureCategory, Feature[]>,
    );

  return (
    <div>
      {Object.keys(featuresByCategory).map((category) => {
        return (
          <div key={category}>
            <div className="my-3 flex items-center gap-3 overflow-x-hidden">
              <span className="inline-flex w-fit text-nowrap font-semibold">
                {t(`common.property.feature.category.${category}`)}
              </span>
              <Separator />
            </div>
            <div className="flex items-center gap-3 px-2">
              {/* Add Other features */}
              <div className="flex flex-wrap gap-2">
                {featuresByCategory[category as FeatureCategory].map((f) => (
                  <FeatureShowcase key={f.key} feature={f} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
