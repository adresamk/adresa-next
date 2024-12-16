import { ListingWithRelations } from "@/types/listing.types";
import {
  Commercial,
  Land,
  Listing,
  Other,
  PropertyCategory,
  Residential,
} from "@prisma/client";
import { useTranslations } from "next-intl";

interface ImportantFeaturesProps {
  listing: Listing;
}
export default function ImportantFeatures({ listing }: ImportantFeaturesProps) {
  const t = useTranslations("");

  const importantFeatures: Record<PropertyCategory, string[]> = {
    residential: ["floor", "bedroomCount", "bathroomCount", "parkingCount"],
    commercial: [],
    land: [],
    other: [],
  };
  const lwr = listing as ListingWithRelations;
  return (
    <div className="mb-6 flex gap-2">
      {importantFeatures[listing.category].map((key: string, idx) => {
        if (!listing.category) return null;

        const categoryData = lwr[listing.category];
        if (!categoryData || !(key in categoryData)) return null;

        return (
          <div key={key}>
            <div className="flex items-center gap-1">
              {idx !== 0 && (
                <span className="h-1 w-1 rounded-full bg-slate-800"></span>
              )}
              <span> {categoryData[key as keyof typeof categoryData]}</span>
              <span>{t(`listing.fieldsKeys.importantFeatures.${key}`)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
