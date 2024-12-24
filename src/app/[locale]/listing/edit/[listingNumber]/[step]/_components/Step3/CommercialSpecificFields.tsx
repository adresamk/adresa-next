import { SelectSelfContained } from "@/components/shared/SelectSelfContained";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListingWithRelations } from "@/types/listing.types";
import { Feature, Listing } from "@prisma/client";
import FancyCounterInput from "../FancyCounterInput";
import { Bath } from "lucide-react";

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

  const heatingTypeOptionsTranslated = [
    { label: "Autonomous", value: "autonomous" },
    { label: "Central", value: "central" },
    { label: "Air-Condition", value: "air-condition" },
    { label: "None", value: "none" },
  ];

  const heatingMediumOptionsTranslated = [
    { label: "Oil", value: "oil" },
    { label: "Natural Gas", value: "natural-gas" },
    { label: "Diesel", value: "diesel" },
    { label: "Electricity", value: "electricity" },
    { label: "Wood", value: "wood" },
    { label: "Solar", value: "solar" },
    { label: "Geothermal", value: "geothermal" },
    { label: "Heat Pump", value: "heat-pump" },
  ];

  const accessFromOptionsTranslated = [
    { label: "Paved", value: "paved" },
    { label: "Asphalt", value: "asphalt" },
    { label: "Pedestrian", value: "pedestrian" },
    { label: "Dirt Road", value: "dirt_road" },
    { label: "Sea", value: "sea" },
    { label: "Other", value: "other" },
    { label: "No Road Access", value: "no_road_access" },
  ];

  const roomsLabelRules = {
    wcCount: {
      "0": "No WC",
      "1": "$$ WC",
      "2-max": "$$ WCs",
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
      <div className="flex flex-col gap-3">
        <Label>Construction Year</Label>
        <Input
          min={1285}
          max={2025}
          type="number"
          name="constructionYear"
          id="constructionYear"
          placeholder="Year when it was built"
          value={listing.commercial.constructionYear || undefined}
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
          value={listing.commercial.totalPropertyArea || undefined}
        />
      </div>

      {/* Floor */}
      <div className="flex flex-col gap-3">
        <Label>Floor</Label>
        {/* Change it to select demo */}
        <Input
          min={0}
          max={100}
          type="number"
          name="floor"
          id="floor"
          placeholder="Floor number"
          value={listing.commercial.floor || undefined}
        />
      </div>

      {/* Is Corner Property */}
      <div className="">
        <Input
          type="checkbox"
          name="isCornerProperty"
          id="isCornerProperty"
          value={"1"}
          defaultChecked={listing.commercial.isCornerProperty}
        />
        <Label>Is Corner Property</Label>
      </div>

      {/* WCS */}
      <div className="flex items-center gap-3">
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

      {/* Is On Top Floor */}
      <div className="flex flex-col gap-3">
        <Label>Is On Top Floor</Label>
        <Input
          type="checkbox"
          name="isOnTopFloor"
          id="isOnTopFloor"
          value={"1"}
          defaultChecked={listing.commercial.isOnTopFloor}
        />
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
          value={listing.commercial.commonExpenses || undefined}
        />
      </div>

      {/* Heating Type */}
      <div className="flex flex-col gap-3">
        <Label>Heating Type</Label>

        <SelectSelfContained
          name="heatingType"
          id="heatingType"
          value={listing.commercial.heatingType}
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
          value={listing.commercial.heatingMedium}
          placeholder="Select Heating Medium"
          options={heatingMediumOptionsTranslated}
        />
      </div>

      {/* Access From */}
      <div className="flex flex-col gap-3">
        <Label>Access From</Label>

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
