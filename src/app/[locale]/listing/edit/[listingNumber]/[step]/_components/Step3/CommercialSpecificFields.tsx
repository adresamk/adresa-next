import { SelectSelfContained } from "@/components/shared/SelectSelfContained";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListingWithRelations } from "@/types/listing.types";
import { Feature, Listing } from "@prisma/client";
import FancyCounterInput from "../FancyCounterInput";
import { Bath } from "lucide-react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";

interface CommercialSpecificFieldsProps {
  listing: Listing;
  allCategoryFeatures: Feature[];
}
export default function CommercialSpecificFields({
  listing: basicTypedListing,
  allCategoryFeatures,
}: CommercialSpecificFieldsProps) {
  const lwr = basicTypedListing as ListingWithRelations;
  const listing = {
    ...lwr,
    commercial: lwr.commercial!,
  };
  const t = useTranslations();

  const heatingTypeOptions = ["autonomous", "central", "air_condition", "none"];
  const heatingTypeOptionsTranslated = heatingTypeOptions.map((option) => ({
    label: t(
      `listing.new.progress.steps.mainCharacteristics.heatingType.heatingTypeOptions.${option}`,
    ),
    value: option,
  }));

  const heatingMediumOptions = [
    "oil",
    "natural_gas",
    "diesel",
    "electricity",
    "wood",
    "solar",
    "geothermal",
    "heat_pump",
  ];
  const heatingMediumOptionsTranslated = heatingMediumOptions.map((option) => ({
    label: t(
      `listing.new.progress.steps.mainCharacteristics.heatingMedium.heatingMediumOptions.${option}`,
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
  const roomsLabelRules = {
    wcCount: {
      "0": `${t(`common.words.without`)} ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.wc`,
      )}`,
      "1": `$$ ${t(`listing.new.progress.steps.mainCharacteristics.rooms.wc`)}`,
      "2-max": `$$ ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.wcs`,
      )}`,
    },
  };
  return (
    <>
      <input
        type="string"
        className="hidden"
        defaultValue={listing.commercial.id}
        name="commercialId"
      />
      {/* Construction Year */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t(
            "listing.new.progress.steps.mainCharacteristics.constructionYear.label",
          )}
        </Label>
        <Input
          min={1285}
          max={2025}
          type="number"
          name="constructionYear"
          id="constructionYear"
          className="max-w-[400px]"
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.constructionYear.placeholder",
          )}
          value={listing.commercial.constructionYear || undefined}
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
          className="max-w-[400px]"
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.totalPropertyArea.placeholder",
          )}
          value={listing.commercial.totalPropertyArea || undefined}
        />
      </div>

      {/* Floor */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t("listing.new.progress.steps.mainCharacteristics.floor.label")}
        </Label>
        {/* Change it to select demo */}
        <Input
          min={0}
          max={100}
          type="number"
          name="floor"
          id="floor"
          className="max-w-[400px]"
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.floor.placeholder",
          )}
          value={listing.commercial.floor || undefined}
        />
      </div>

      {/* Is Corner Property */}
      <div className="mt-2 flex items-center gap-3">
        <Checkbox
          name="isCornerProperty"
          id="isCornerProperty"
          defaultValue={"1"}
          defaultChecked={listing.commercial.isCornerProperty}
        />
        <Label htmlFor="isCornerProperty">
          {t(
            "listing.new.progress.steps.mainCharacteristics.isCornerProperty.label",
          )}
        </Label>
      </div>

      {/* Is On Top Floor */}
      <div className="my-3 flex gap-3">
        <Checkbox
          name="isOnTopFloor"
          id="isOnTopFloor"
          defaultValue={"1"}
          defaultChecked={listing.commercial.isOnTopFloor}
        />
        <Label htmlFor="isOnTopFloor">
          {t(
            "listing.new.progress.steps.mainCharacteristics.isOnTopFloor.label",
          )}
        </Label>
      </div>
      {/* WCS */}
      <div className="my-4 flex items-center gap-3">
        <Bath className="h-8 w-8" />
        <FancyCounterInput
          name="wcCount"
          id="wcCount"
          min={0}
          max={10}
          startingValue={listing.commercial.wcCount}
          labelRules={roomsLabelRules.wcCount}
        />
      </div>

      {/* Common Expenses */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t(
            "listing.new.progress.steps.mainCharacteristics.commonExpenses.label",
          )}
        </Label>
        <p className="max-w-[400px] text-sm text-slate-500">
          {t(
            "listing.new.progress.steps.mainCharacteristics.commonExpenses.description",
          )}
        </p>
        <Input
          min={0}
          max={300}
          type="number"
          className="max-w-[400px]"
          name="commonExpenses"
          id="commonExpenses"
          value={listing.commercial.commonExpenses || undefined}
        />
      </div>

      {/* Heating Type */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t(
            "listing.new.progress.steps.mainCharacteristics.heatingType.label",
          )}
        </Label>

        <SelectSelfContained
          name="heatingType"
          id="heatingType"
          value={listing.commercial.heatingType}
          placeholder="Select Heating Type"
          options={heatingTypeOptionsTranslated}
        />
      </div>

      {/* Heating Medium */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t(
            "listing.new.progress.steps.mainCharacteristics.heatingMedium.label",
          )}
        </Label>

        <SelectSelfContained
          name="heatingMedium"
          id="heatingMedium"
          value={listing.commercial.heatingMedium}
          placeholder="Select Heating Medium"
          options={heatingMediumOptionsTranslated}
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
          value={listing.commercial.accessFrom}
          placeholder="Select Access From"
          options={accessFromOptionsTranslated}
        />
      </div>
    </>
  );
}
