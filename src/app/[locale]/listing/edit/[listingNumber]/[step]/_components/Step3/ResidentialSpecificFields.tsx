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

  const heatingTypeOptionsTranslated = [
    { label: "Autonomous", value: "autonomous" },
    { label: "Central", value: "central" },
    { label: "Air-Condition", value: "air_condition" },
    { label: "None", value: "none" },
  ];

  const heatingMediumOptionsTranslated = [
    { label: "Oil", value: "oil" },
    { label: "Natural Gas", value: "natural_gas" },
    { label: "Diesel", value: "diesel" },
    { label: "Electricity", value: "electricity" },
    { label: "Wood", value: "wood" },
    { label: "Solar", value: "solar" },
    { label: "Geothermal", value: "geothermal" },
    { label: "Heat Pump", value: "heat_pump" },
  ];

  console.log(listing.listingFeatures);
  // const initialRoomsState = residentialRoomFeatures.reduce((acc, feature) => {
  //   const matchingFeature = listing.listingFeature.find(
  //     (lf) => lf.featureId === feature.id,
  //   );

  //   acc[feature.name] = matchingFeature ? matchingFeature.value : 1; // Default to 1 if no match
  //   return acc;
  // }, {});

  const roomsLabelRules = {
    bathroomCount: {
      "0": "No Bathroom",
      "1": "$$ Bathroom",
      "2-max": "$$ Bathrooms",
    },
    wcCount: {
      "0": "No WC",
      "1": "$$ WC",
      "2-max": "$$ WCs",
    },
    kitchenCount: {
      "0": "No Kitchen",
      "1": "$$ Kitchen",
      "2-max": "$$ Kitchens",
    },
    livingRoomCount: {
      "0": "No Living Room",
      "1": "$$ Living Room",
      "2-max": "$$ Living Rooms",
    },
    bedroomCount: {
      "0": "No Bedroom",
      "1": "$$ Bedroom",
      "2-max": "$$ Bedrooms",
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
          {t("listing.new.progress.steps.mainCharacteristics.floor")}
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
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.floorPlaceholder",
            )}
            defaultValue={listing.residential.floor || undefined}
          />
        </div>
      </div>

      {/* Total Floors */}
      <div className="flex flex-col gap-3">
        <Label>Total Floors</Label>
        <Input
          min={0}
          max={100}
          type="number"
          name="totalFloors"
          id="totalFloors"
          placeholder="Total floors"
          defaultValue={listing.residential.totalFloors || undefined}
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
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.orientationPlaceholder",
            )}
            value={listing.residential.orientation}
            options={orientationOptionsTranslated}
          />
        </div>
      </div>

      {/* Construction Year */}
      <div className="flex flex-col gap-3">
        <Label>Construction Year</Label>
        <Input
          min={1285}
          max={2025}
          type="number"
          name="constructionYear"
          id="constructionYear"
          placeholder="Year when it was built"
          defaultValue={listing.residential.constructionYear || undefined}
        />
      </div>

      {/* Total Property Area */}
      <div className="flex flex-col gap-3">
        <Label>Total Property Area</Label>
        <Input
          min={1}
          max={10000}
          type="number"
          name="totalPropertyArea"
          id="totalPropertyArea"
          placeholder="Total property area in square meters"
          defaultValue={listing.residential.totalPropertyArea || undefined}
        />
      </div>

      {/* Zone */}
      <div className="flex flex-col gap-3">
        <Label>Zone</Label>
        <SelectSelfContained
          value={listing.residential.zone}
          options={zoneOptionsTranslated}
          name="zone"
          id="zone"
          placeholder="Zone"
        />
      </div>
      {/* Rooms */}
      <div className="flex flex-col gap-3">
        <Label>Rooms</Label>
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
      <div className="flex flex-col gap-3">
        <Label>Common Expenses</Label>
        <p className="text-sm text-slate-500">
          Common expenses are the expenses that are shared by the tenants of the
          property per month, as an orientational number in euros without rent.
        </p>
        <Input
          min={0}
          max={300}
          type="number"
          name="commonExpenses"
          id="commonExpenses"
          defaultValue={listing.residential.commonExpenses || undefined}
        />
      </div>

      {/* Heating Type */}
      <div className="flex flex-col gap-3">
        <Label>Heating Type</Label>

        <SelectSelfContained
          name="heatingType"
          id="heatingType"
          value={listing.residential.heatingType}
          placeholder="Select Heating Type"
          options={heatingTypeOptionsTranslated}
        />
      </div>

      {/* Heating Medium */}
      <div className="flex flex-col gap-3">
        <Label>Heating Medium</Label>

        <SelectSelfContained
          name="heatingMedium"
          id="heatingMedium"
          value={listing.residential.heatingMedium}
          placeholder="Select Heating Medium"
          options={heatingMediumOptionsTranslated}
        />
      </div>

      {/* Is Furnished */}
      <div className="flex flex-col gap-3">
        <Label>Is Furnished</Label>
        <Input
          type="checkbox"
          name="isFurnished"
          id="isFurnished"
          defaultValue={"1"}
          defaultChecked={listing.residential.isFurnished}
        />
      </div>

      {/* Is For Students */}
      <div className="flex flex-col gap-3">
        <Label>Is For Students</Label>
        <Input
          type="checkbox"
          name="isForStudents"
          id="isForStudents"
          defaultValue={"1"}
          defaultChecked={listing.residential.isForStudents}
        />
      </div>

      {/* Is For Holiday Home */}
      <div className="flex flex-col gap-3">
        <Label>Is For Holiday Home</Label>
        <Input
          type="checkbox"
          name="isForHolidayHome"
          id="isForHolidayHome"
          defaultValue={"1"}
          defaultChecked={listing.residential.isForHolidayHome}
        />
      </div>
    </>
  );
}
