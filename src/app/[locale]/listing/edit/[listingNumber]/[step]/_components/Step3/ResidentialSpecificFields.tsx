"use client";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { orientationOptions } from "@/lib/data/listing/importantData";
import {
  Feature,
  FeatureCategory,
  Listing,
  PropertyCategory,
} from "@prisma/client";
import { Bath, ChefHat, Bed, ShowerHead, Sofa } from "lucide-react";
import { useTranslations } from "next-intl";
import FancyCounterInput from "../FancyCounterInput";
import { ListingWithRelations } from "@/types/listing.types";
import { SelectSelfContained } from "@/components/shared/SelectSelfContained";

interface ResidentialSpecificFieldsProps {
  listing: Listing;
  allCategoryFeatures: Feature[];
}
export default function ResidentialSpecificFields({
  listing: basicTypedListing,
  allCategoryFeatures,
}: ResidentialSpecificFieldsProps) {
  const lwr = basicTypedListing as ListingWithRelations;
  const listing = {
    ...lwr,
    residential: lwr.residential!,
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

  const roomsLabelRules = {
    bathroomCount: {
      "0": `${t(`common.words.without`)} ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.bathroom`,
      )}`,
      "1": `$$ ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.bathroom`,
      )}`,
      "2-max": `$$ ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.bathrooms`,
      )}`,
    },
    wcCount: {
      "0": `${t(`common.words.without`)} ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.wc`,
      )}`,
      "1": `$$ ${t(`listing.new.progress.steps.mainCharacteristics.rooms.wc`)}`,
      "2-max": `$$ ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.wcs`,
      )}`,
    },
    kitchenCount: {
      "0": `${t(`common.words.without`)} ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.kitchen`,
      )}`,
      "1": `$$ ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.kitchen`,
      )}`,
      "2-max": `$$ ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.kitchens`,
      )}`,
    },
    livingRoomCount: {
      "0": `${t(`common.words.without`)} ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.livingRoom`,
      )}`,
      "1": `$$ ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.livingRoom`,
      )}`,
      "2-max": `$$ ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.livingRooms`,
      )}`,
    },
    bedroomCount: {
      "0": `${t(`common.words.without`)} ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.bedroom`,
      )}`,
      "1": `$$ ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.bedroom`,
      )}`,
      "2-max": `$$ ${t(
        `listing.new.progress.steps.mainCharacteristics.rooms.bedrooms`,
      )}`,
    },
  };
  return (
    <>
      {/* Floor Number */}
      <input
        type="string"
        className="hidden"
        defaultValue={listing.residential.id}
        name="residentialId"
      />
      <div className="flex flex-col gap-3">
        <Label htmlFor="floor">
          {t("listing.new.progress.steps.mainCharacteristics.floor.label")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] items-center">
          <Input
            type="number"
            name="floor"
            id="floor"
            required
            min={0}
            max={30}
            className="max-w-[400px]"
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.floor.placeholder",
            )}
            defaultValue={listing.residential.floor || undefined}
          />
        </div>
      </div>

      {/* Total Floors */}
      <div className="flex flex-col gap-3">
        <Label>
          {t(
            "listing.new.progress.steps.mainCharacteristics.totalFloors.label",
          )}
        </Label>
        <Input
          min={0}
          max={100}
          type="number"
          name="totalFloors"
          id="totalFloors"
          className="max-w-[400px]"
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.totalFloors.placeholder",
          )}
          defaultValue={listing.residential.totalFloors || undefined}
        />
      </div>

      {/* Orientation */}
      <div className="mt-2 flex flex-col gap-3">
        <Label htmlFor="orientation">
          {t(
            "listing.new.progress.steps.mainCharacteristics.orientation.label",
          )}
          <span className="text-red-500">*</span>
        </Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] items-center">
          <SelectSelfContained
            name="orientation"
            triggerWidth="260px"
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.orientation.placeholder",
            )}
            value={listing.residential.orientation}
            options={orientationOptionsTranslated}
          />
        </div>
      </div>

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
          defaultValue={listing.residential.constructionYear || undefined}
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
          defaultValue={listing.residential.totalPropertyArea || undefined}
        />
      </div>

      {/* Zone */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t("listing.new.progress.steps.mainCharacteristics.zone.label")}
        </Label>
        <SelectSelfContained
          triggerWidth="260px"
          value={listing.residential.zone}
          options={zoneOptionsTranslated}
          name="zone"
          id="zone"
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.zone.placeholder",
          )}
        />
      </div>
      {/* Rooms */}
      <div className="mt-2 flex flex-col gap-3">
        <Label>
          {t("listing.new.progress.steps.mainCharacteristics.rooms.label")}
        </Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] flex-col gap-2">
          {/* Bedrooms */}

          <div className="flex items-center gap-3">
            <Bed className="h-8 w-8" />
            <FancyCounterInput
              startingValue={listing.residential.bedroomCount}
              min={0}
              max={10}
              name="bedroomCount"
              id="bedroomCount"
              labelRules={roomsLabelRules.bedroomCount}
            />
          </div>
          {/* Bathrooms */}
          <div className="flex items-center gap-3">
            <ShowerHead className="h-8 w-8" />
            <FancyCounterInput
              name="bathroomCount"
              id="bathroomCount"
              min={0}
              max={10}
              startingValue={listing.residential.bathroomCount}
              labelRules={roomsLabelRules.bathroomCount}
            />
          </div>
          {/* WCS */}
          <div className="flex items-center gap-3">
            <Bath className="h-8 w-8" />
            <FancyCounterInput
              name="wcCount"
              id="wcCount"
              min={0}
              max={10}
              startingValue={listing.residential.wcCount}
              labelRules={roomsLabelRules.wcCount}
            />
          </div>
          {/* Kitchens */}
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8" />
            <FancyCounterInput
              name="kitchenCount"
              id="kitchenCount"
              min={0}
              max={10}
              startingValue={listing.residential.kitchenCount}
              labelRules={roomsLabelRules.kitchenCount}
            />
          </div>

          {/* Living Rooms */}
          <div className="flex items-center gap-3">
            <Sofa className="h-8 w-8" />
            <FancyCounterInput
              name="livingRoomCount"
              id="livingRoomCount"
              min={0}
              max={10}
              startingValue={listing.residential.livingRoomCount}
              labelRules={roomsLabelRules.livingRoomCount}
            />
          </div>
        </div>
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
        <div className="relative">
          <div className="absolute left-1.5 top-1">€</div>
          <Input
            min={0}
            max={300}
            type="number"
            name="commonExpenses"
            id="commonExpenses"
            className="max-w-[400px] pl-6"
            defaultValue={listing.residential.commonExpenses || undefined}
          />
        </div>
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
          triggerWidth="260px"
          value={listing.residential.heatingType}
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.heatingType.placeholder",
          )}
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
          triggerWidth="260px"
          value={listing.residential.heatingMedium}
          placeholder={t(
            "listing.new.progress.steps.mainCharacteristics.heatingMedium.placeholder",
          )}
          options={heatingMediumOptionsTranslated}
        />
      </div>

      {/* Is Furnished */}
      <div className="my-2 flex gap-3 py-2">
        <input
          type="checkbox"
          name="isFurnished"
          id="isFurnished"
          defaultValue={"1"}
          defaultChecked={listing.residential.isFurnished}
        />
        <Label htmlFor="isFurnished">
          {t(
            "listing.new.progress.steps.mainCharacteristics.isFurnished.label",
          )}
        </Label>
      </div>

      {/* Is For Students */}
      <div className="my-2 flex gap-3 py-2">
        <input
          type="checkbox"
          name="isForStudents"
          id="isForStudents"
          defaultValue={"1"}
          defaultChecked={listing.residential.isForStudents}
        />
        <Label htmlFor="isForStudents">
          {t(
            "listing.new.progress.steps.mainCharacteristics.isForStudents.label",
          )}
        </Label>
      </div>

      {/* Is For Holiday Home */}
      <div className="my-2 flex gap-3 py-2">
        <input
          type="checkbox"
          name="isForHolidayHome"
          id="isForHolidayHome"
          defaultValue={"1"}
          defaultChecked={listing.residential.isForHolidayHome}
        />
        <Label htmlFor="isForHolidayHome">
          {t(
            "listing.new.progress.steps.mainCharacteristics.isForHolidayHome.label",
          )}
        </Label>
      </div>
    </>
  );
}
