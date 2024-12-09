"use client";

import { RadioGroupDemo } from "@/components/shared/RadioGroupDemo";
import { SelectDemo } from "@/components/shared/SelectDemo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Feature,
  FeatureCategory,
  Listing,
  PropertyCategory,
} from "@prisma/client";

import { displayPrice } from "@/lib/utils";
import {
  Bath,
  Bed,
  Building,
  ChefHat,
  DoorClosed,
  Euro,
  Fence,
  ParkingSquare,
  ShowerHead,
  Sofa,
} from "lucide-react";
import { useState } from "react";
import { orientationOptions } from "@/lib/data/listing/importantData";
import FancyCounterInput from "../_components/FancyCounterInput";
import { useTranslations } from "next-intl";
import { ListingWithRelations } from "@/types/listing.types";
import prismadb from "@/lib/db";
import { GetServerSideProps } from "next";

function featuresValues(value: boolean | null) {
  if (value === true) return "yes";
  if (value === false) return "no";
}

export default function Step3({
  listing: basicTypedListing,
  allFeatures,
}: {
  listing: Listing;
  allFeatures: Feature[];
}) {
  const lwr = basicTypedListing as ListingWithRelations;

  const listing = {
    ...lwr,
    floor: lwr.residential?.floor || lwr.commercial?.floor,
    totalFloors: lwr.residential?.totalFloors,
    orientation: lwr.residential?.orientation || lwr.land?.orientation,
    zone: lwr.residential?.zone || lwr.land?.zone,
    constructionYear:
      lwr.residential?.constructionYear || lwr.commercial?.constructionYear,
    totalPropertyArea:
      lwr.residential?.totalPropertyArea ||
      lwr.commercial?.totalPropertyArea ||
      lwr.other?.totalPropertyArea,
    isFurnished: lwr.residential?.isFurnished,
    isForStudents: lwr.residential?.isForStudents,
    isForHolidayHome: lwr.residential?.isForHolidayHome,
    commonExpenses:
      lwr.residential?.commonExpenses || lwr.commercial?.commonExpenses,
    heatingType: lwr.residential?.heatingType || lwr.commercial?.heatingType,
    heatingMedium:
      lwr.residential?.heatingMedium || lwr.commercial?.heatingMedium,
    isCornerProperty:
      lwr.commercial?.isCornerProperty || lwr.land?.isCornerProperty,
    isOnTopFloor: lwr.commercial?.isOnTopFloor,
    accessFrom:
      lwr.commercial?.accessFrom ||
      lwr.land?.accessFrom ||
      lwr.other?.accessFrom,
    slope: lwr.land?.slope,
    propertyType: lwr.land?.propertyType,
  };

  const t = useTranslations();
  const [propertyPrice, setPropertyPrice] = useState(
    listing.price ? displayPrice(listing.price) : "",
  );
  const [propertyArea, setPropertyArea] = useState(listing.area?.toString());
  const [floor, setFloor] = useState(listing.floor || "");
  const [orientation, setOrientation] = useState(listing.orientation || "");

  const orientationOptionsTranslated = orientationOptions.map((option) => ({
    label: t(
      `listing.new.progress.steps.mainCharacteristics.orientationOptions.${option}`,
    ),
    value: option,
  }));

  const residentialRoomFeatures = allFeatures.filter(
    (feature) =>
      feature.category === FeatureCategory.ROOMS &&
      feature.applicableTypes.includes(PropertyCategory.residential),
  );
  const extraFeaturesValues = ["yes", "no"].map((option) => ({
    label: t(`common.buttons.${option}`),
    value: option,
  }));
  const initialRoomsState: Record<string, number> = {};

  residentialRoomFeatures.forEach((rrf) => {
    const matchingFeature = listing.listingFeatures.find(
      (lf) => lf.featureId === rrf.id,
    );

    initialRoomsState[rrf.key] = matchingFeature
      ? Number(matchingFeature.value)
      : 0; // Default to 1 if no match
  });
  // const initialRoomsState = residentialRoomFeatures.reduce((acc, feature) => {
  //   const matchingFeature = listing.listingFeature.find(
  //     (lf) => lf.featureId === feature.id,
  //   );

  //   acc[feature.name] = matchingFeature ? matchingFeature.value : 1; // Default to 1 if no match
  //   return acc;
  // }, {});
  const rooms = initialRoomsState;
  // const [rooms, setRooms] = useState(initialRoomsState);
  const residentialOtherFeatures = allFeatures.filter(
    (feature) =>
      feature.category === FeatureCategory.RESIDENTAL_OTHER &&
      feature.applicableTypes.includes(PropertyCategory.residential),
  );
  const initialResidentialOtherFeaturesState: Record<string, boolean> = {};

  residentialOtherFeatures.forEach((rof) => {
    const matchingFeature = listing.listingFeatures.find(
      (lf) => lf.featureId === rof.id,
    );

    initialResidentialOtherFeaturesState[rof.key] = matchingFeature
      ? matchingFeature.value === "1"
      : false;
  });
  const otherFeatures = initialResidentialOtherFeaturesState;

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="3" name="step" />
      <h2 className="text-lg">
        {t("listing.new.progress.steps.mainCharacteristics.title")}
      </h2>
      <Separator className="my-2 mt-4" />
      {/* Price */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="price">
          {t("listing.new.progress.steps.mainCharacteristics.price")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] items-center">
          <div className="mr-2 w-5">
            <Euro size={18} />
          </div>
          <Input
            required
            name="price"
            id="price"
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.pricePlaceholder",
            )}
            value={propertyPrice.replace("$", "").replace("€", "")}
            onChange={(e) => {
              // With Ai tell the code to make a splitter for number, comma after 3 digits

              // setPropertyPrice(e.target.value);
              const newValue = e.target.value.replace(/[^0-9]/g, "");
              const formattedValue = displayPrice(Number(newValue))
                .replace("$", "")
                .replace("€", "");
              setPropertyPrice(formattedValue);
            }}
          />
        </div>
      </div>
      {/* Area */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="area">
          {t("listing.new.progress.steps.mainCharacteristics.area")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] items-center">
          <div className="mr-2 w-5">
            m<sup>2</sup>
          </div>
          <Input
            required
            type="number"
            name="area"
            id="area"
            min={1}
            max={3000}
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.areaPlaceholder",
            )}
            value={propertyArea || 1}
            onChange={(e) => {
              let newValue = e.target.value.replace(/[^0-9]/g, "");
              if (Number(newValue) > 3000) {
                newValue = "3000";
              }
              setPropertyArea(newValue);
            }}
          />
        </div>
      </div>
      {/* Floor Number */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="floorNumber">
          {t("listing.new.progress.steps.mainCharacteristics.floor")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] items-center">
          <Input
            type="number"
            name="floorNumber"
            id="floorNumber"
            min={0}
            max={30}
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.floorPlaceholder",
            )}
            value={floor}
            onChange={(e) => {
              let newValue = e.target.value.replace(/[^0-9]/g, "");
              if (Number(newValue) > 30) {
                newValue = "30";
              }
              setFloor(newValue);
            }}
          />
        </div>
      </div>

      {/* Orientation */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="orientation">
          {t("listing.new.progress.steps.mainCharacteristics.orientation")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] items-center">
          <SelectDemo
            name="orientation"
            onClick={(value) => setOrientation(value)}
            placeholder={t(
              "listing.new.progress.steps.mainCharacteristics.orientationPlaceholder",
            )}
            value={orientation}
            options={orientationOptionsTranslated}
          />
        </div>
      </div>
      {/* FEATURE THINGY */}

      {/* Rooms */}
      <div className="flex flex-col gap-3">
        <Label>Rooms</Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] flex-col gap-2">
          {/* Bedrooms */}

          <div className="flex items-center gap-3">
            <Bed className="h-8 w-8" />
            <FancyCounterInput
              startingValue={rooms.bedroom}
              min={0}
              max={10}
              name="bedroom"
              id="bedroom"
              labelRules={{
                "0": "No Bedroom",
                "1": "$$ Bedroom",
                "2-max": "$$ Bedrooms",
              }}
            />
          </div>
          {/* Bathrooms */}
          <div className="flex items-center gap-3">
            <ShowerHead className="h-8 w-8" />
            <FancyCounterInput
              name="bathroom"
              id="bathroom"
              min={0}
              max={10}
              startingValue={rooms.bathroom}
              labelRules={{
                "0": "No Bathroom",
                "1": "$$ Bathroom",
                "2-max": "$$ Bathrooms",
              }}
            />
          </div>
          {/* WCS */}
          <div className="flex items-center gap-3">
            <Bath className="h-8 w-8" />
            <FancyCounterInput
              name="wc"
              id="wc"
              min={0}
              max={10}
              startingValue={rooms.wcs}
              labelRules={{
                "0": "No WC",
                "1": "$$ WC",
                "2-max": "$$ WCs",
              }}
            />
          </div>
          {/* Kitchens */}
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8" />
            <FancyCounterInput
              name="kitchen"
              id="kitchen"
              min={0}
              max={10}
              startingValue={rooms.kitchen}
              labelRules={{
                "0": "No Kitchen",
                "1": "$$ Kitchen",
                "2-max": "$$ Kitchens",
              }}
            />
          </div>

          {/* Living Rooms */}
          <div className="flex items-center gap-3">
            <Sofa className="h-8 w-8" />
            <FancyCounterInput
              name="living"
              id="living"
              min={0}
              max={10}
              startingValue={rooms.living}
              labelRules={{
                "0": "No Living Room",
                "1": "$$ Living Room",
                "2-max": "$$ Living Rooms",
              }}
            />
          </div>
        </div>
      </div>
      {/* FEATURE THINGY */}
      <div className="flex flex-col gap-3">
        <Label>Other characteristics</Label>
        <div className="mb-2 flex w-1/2 min-w-[300px] flex-col">
          {/* Parking */}
          <div className="flex items-center">
            <ParkingSquare />
            <RadioGroupDemo
              name="parking"
              direction="horisontal"
              defaultValue={featuresValues(otherFeatures.parking)}
              title="Parking"
              options={extraFeaturesValues}
            />
          </div>
          {/* Elevator */}
          <div className="flex items-center">
            <DoorClosed />
            <RadioGroupDemo
              name="elevator"
              direction="horisontal"
              title="Elevator"
              options={extraFeaturesValues}
              defaultValue={featuresValues(otherFeatures.elevator)}
            />
          </div>
          {/* Balcony */}
          <div className="flex items-center">
            <Fence />
            <RadioGroupDemo
              name="balcony"
              direction="horisontal"
              title="Balcony"
              options={extraFeaturesValues}
              defaultValue={featuresValues(otherFeatures.balcony)}
            />
          </div>
          {/* Yard */}
          <div className="flex items-center">
            <Fence />
            <RadioGroupDemo
              direction="horisontal"
              name="yard"
              title="Yard"
              options={extraFeaturesValues}
              defaultValue={featuresValues(otherFeatures.yard)}
            />
          </div>
          {/* Basement */}
          <div className="flex items-center">
            <Building />
            <RadioGroupDemo
              direction="horisontal"
              name="basement"
              title="Basement"
              options={extraFeaturesValues}
              defaultValue={featuresValues(otherFeatures.basement)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
