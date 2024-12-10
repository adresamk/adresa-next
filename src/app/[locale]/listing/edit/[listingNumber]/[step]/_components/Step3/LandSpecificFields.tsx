import { SelectSelfContained } from "@/components/shared/SelectSelfContained";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orientationOptions } from "@/lib/data/listing/importantData";
import { ListingWithRelations } from "@/types/listing.types";
import { Feature, Listing } from "@prisma/client";
import { useTranslations } from "next-intl";

interface LandSpecificFieldsProps {
  listing: Listing;
  allFeatures: Feature[];
}
export default function LandSpecificFields({
  listing: basicTypedListing,
  allFeatures,
}: LandSpecificFieldsProps) {
  const lwr = basicTypedListing as ListingWithRelations;
  const listing = {
    ...lwr,
    land: lwr.land!,
  };

  const t = useTranslations();

  const orientationOptionsTranslated = orientationOptions.map((option) => ({
    label: t(
      `listing.new.progress.steps.mainCharacteristics.orientationOptions.${option}`,
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

  const accessFromOptionsTranslated = [
    { label: "Paved", value: "paved" },
    { label: "Asphalt", value: "asphalt" },
    { label: "Pedestrian", value: "pedestrian" },
    { label: "Dirt Road", value: "dirt-road" },
    { label: "Sea", value: "sea" },
    { label: "Other", value: "other" },
    { label: "No Road Access", value: "no-road-access" },
  ];

  const slopeOptionsTranslated = [
    { label: "Flat", value: "flat" },
    { label: "Inclined", value: "inclined" },
    { label: "Steep", value: "steep" },
  ];

  return (
    <>
      {/* Is Corner Property */}
      <div className="flex flex-col gap-3">
        <Label>Is Corner Property</Label>
        <Input
          type="checkbox"
          name="isCornerProperty"
          id="isCornerProperty"
          value={"1"}
          defaultChecked={listing.land.isCornerProperty}
        />
      </div>

      {/* Orientation */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="orientation">
          {t("listing.new.progress.steps.mainCharacteristics.orientation")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] items-center">
          <SelectSelfContained
            name="orientation"
            id="orientation"
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.orientationPlaceholder",
            )}
            value={listing.land.orientation}
            options={orientationOptionsTranslated}
          />
        </div>
      </div>

      {/* Zone */}
      <div className="flex flex-col gap-3">
        <Label>Zone</Label>
        <SelectSelfContained
          value={listing.land.zone}
          options={zoneOptionsTranslated}
          name="zone"
          id="zone"
          placeholder="Zone"
        />
      </div>

      {/* Access From */}
      <div className="flex flex-col gap-3">
        <Label>Access From</Label>

        <SelectSelfContained
          name="accessFrom"
          id="heatingMedium"
          value={listing.land.accessFrom}
          placeholder="Select Access From"
          options={accessFromOptionsTranslated}
        />
      </div>

      {/*Slope */}
      <div className="flex flex-col gap-3">
        <Label>Slope</Label>

        <SelectSelfContained
          name="slope"
          id="slope"
          value={listing.land.slope}
          placeholder="Select Slope"
          options={slopeOptionsTranslated}
        />
      </div>
    </>
  );
}
