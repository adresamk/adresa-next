import { SelectSelfContained } from "@/components/shared/SelectSelfContained";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListingWithRelations } from "@/types/listing.types";
import { Feature, Listing } from "@prisma/client";
import { useTranslations } from "next-intl";

interface OtherSpecificFieldsProps {
  listing: Listing;
  allCategoryFeatures: Feature[];
}
export default function OtherSpecificFields({
  listing: basicTypedListing,
  allCategoryFeatures,
}: OtherSpecificFieldsProps) {
  const lwr = basicTypedListing as ListingWithRelations;
  const listing = {
    ...lwr,
    other: lwr.other!,
  };
  const t = useTranslations();
  const accessFromOptions = [
    "paved",
    "asphalt",
    "pedestrian",
    "dirt_road",
    "sea",
    "other",
    "no_road_access",
  ];
  const accessFromOptionsTranslated = accessFromOptions.map((option) => ({
    label: t(
      `listing.new.progress.steps.mainCharacteristics.accessFrom.accessFromOptions.${option}`,
    ),
    value: option,
  }));

  return (
    <>
      <input
        type="string"
        className="hidden"
        defaultValue={listing.other.id}
        name="otherId"
      />
      {/* Access From */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t("listing.new.progress.steps.mainCharacteristics.accessFrom.label")}
        </Label>

        <SelectSelfContained
          name="accessFrom"
          id="heatingMedium"
          value={listing.other.accessFrom}
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.accessFrom.placeholder",
          )}
          options={accessFromOptionsTranslated}
        />
      </div>

      {/* Total Property Area */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t(
            "listing.new.progress.steps.mainCharacteristics.totalPropertyArea.label",
          )}
        </Label>
        <Input
          min={1}
          max={10000}
          type="number"
          name="totalPropertyArea"
          id="totalPropertyArea"
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.totalPropertyArea.placeholder",
          )}
          value={listing.other.totalPropertyArea || undefined}
        />
      </div>
    </>
  );
}
