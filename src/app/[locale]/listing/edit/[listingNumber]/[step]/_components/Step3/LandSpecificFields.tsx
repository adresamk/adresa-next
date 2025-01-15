import { SelectSelfContained } from "@/components/shared/SelectSelfContained";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orientationOptions } from "@/lib/data/listing/importantData";
import { ListingWithRelations } from "@/types/listing.types";
import { Feature, Listing } from "@prisma/client";
import { useTranslations } from "next-intl";

interface LandSpecificFieldsProps {
  listing: Listing;
  allCategoryFeatures: Feature[];
}
export default function LandSpecificFields({
  listing: basicTypedListing,
  allCategoryFeatures,
}: LandSpecificFieldsProps) {
  const lwr = basicTypedListing as ListingWithRelations;
  const listing = {
    ...lwr,
    land: lwr.land!,
  };

  const t = useTranslations();

  const orientationOptionsTranslated = orientationOptions.map((option) => ({
    label: t(
      `listing.new.progress.steps.mainCharacteristics.orientation.orientationOptions.${option}`,
    ),
    value: option,
  }));
  const zoneOptions = [
    "residential",
    "commercial",
    "agricultural",
    "industrial",
    "recreational",
    "unincorporated",
  ];
  const zoneOptionsTranslated = zoneOptions.map((option) => ({
    label: t(
      `listing.new.progress.steps.mainCharacteristics.zone.zoneOptions.${option}`,
    ),
    value: option,
  }));

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

  const slopeOptions = ["flat", "inclined", "steep"];
  const slopeOptionsTranslated = slopeOptions.map((option) => ({
    label: t(
      `listing.new.progress.steps.mainCharacteristics.slope.slopeOptions.${option}`,
    ),
    value: option,
  }));

  return (
    <>
      <input
        type="string"
        className="hidden"
        defaultValue={listing.land.id}
        name="landId"
      />
      {/* Is Corner Property */}
      <div className="flex items-center gap-2 py-3">
        <Checkbox
          name="isCornerProperty"
          id="isCornerProperty"
          defaultValue={"1"}
          defaultChecked={listing.land.isCornerProperty}
        />
        <Label htmlFor="isCornerProperty">
          {t(
            "listing.new.progress.steps.mainCharacteristics.isCornerProperty.label",
          )}
        </Label>
      </div>

      {/* Orientation */}
      <div className="mt-2 flex flex-col gap-3">
        <Label htmlFor="orientation">
          {t(
            "listing.new.progress.steps.mainCharacteristics.orientation.label",
          )}
        </Label>
        <div className="mb-2 mt-2 flex w-1/2 min-w-[300px] items-center">
          <SelectSelfContained
            name="orientation"
            id="orientation"
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.orientation.placeholder",
            )}
            value={listing.land.orientation}
            options={orientationOptionsTranslated}
          />
        </div>
      </div>

      {/* Zone */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t("listing.new.progress.steps.mainCharacteristics.zone.label")}
        </Label>
        <SelectSelfContained
          value={listing.land.zone}
          options={zoneOptionsTranslated}
          name="zone"
          id="zone"
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.zone.placeholder",
          )}
        />
      </div>

      {/* Access From */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t("listing.new.progress.steps.mainCharacteristics.accessFrom.label")}
        </Label>

        <SelectSelfContained
          name="accessFrom"
          id="heatingMedium"
          value={listing.land.accessFrom}
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.accessFrom.placeholder",
          )}
          options={accessFromOptionsTranslated}
        />
      </div>

      {/*Slope */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t("listing.new.progress.steps.mainCharacteristics.slope.label")}
        </Label>

        <SelectSelfContained
          name="slope"
          id="slope"
          value={listing.land.slope}
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.slope.placeholder",
          )}
          options={slopeOptionsTranslated}
        />
      </div>
    </>
  );
}
