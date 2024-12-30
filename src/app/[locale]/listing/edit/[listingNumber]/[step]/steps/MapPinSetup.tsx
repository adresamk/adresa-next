"use client";

import { useState, useCallback, useEffect } from "react";
import { Listing, LocationPrecision } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPosition, roundToNearest6 } from "../_components/mapHelpers";
import ConfirmLocation from "../_components/ConfirmLocation";

import { useTranslations } from "next-intl";
import { SelectSelfContained } from "@/components/shared/SelectSelfContained";
import { locationPrecisionOptions } from "@/lib/data/listing/importantData";
import MapConfirmLocation from "../_components/MapConfirmLocation";

export default function MapPinSetup({
  listing,
  municipality,
  place,
}: {
  listing: Listing;
  municipality: string;
  place: string;
}) {
  // municipality and place should be there otherwise the map wont render
  const t = useTranslations();

  const [coordinatesAsText, setCoordinatesAsText] = useState<string>(() => {
    if (!listing.latitude || !listing.longitude) {
      return "";
    }
    return `${listing.latitude},${listing.longitude}`;
  });

  const [pinLocation, setPinLocation] = useState<MapPosition | null>(() => {
    if (!listing.latitude || !listing.longitude) {
      return null;
    }
    return {
      lat: listing.latitude,
      lng: listing.longitude,
    };
  });
  //effect description
  useEffect(() => {
    if (pinLocation) {
      setCoordinatesAsText(
        pinLocation?.lat.toString() + "," + pinLocation?.lng.toString(),
      );
    }
  }, [pinLocation]);
  const locationPrecisionOptionsTranslated = locationPrecisionOptions.map(
    (option) => ({
      label: t(
        `listing.new.progress.steps.location.map.locationPrecisionOptions.${option}`,
      ),
      value: option,
    }),
  );

  return (
    <div className="mt-3">
      <h2 className="text-lg">
        {t("listing.new.progress.steps.location.map.confirmLocation")}
      </h2>
      <Separator className="my-2" />

      {/* Single input for latitude and longitude */}
      <div className="mt-2 space-y-2">
        <Label htmlFor="locationPrecision">
          {t("listing.new.progress.steps.location.map.locationPrecision")}
        </Label>
        <SelectSelfContained
          placeholder={t(
            "listing.new.progress.steps.location.map.locationPrecisionPlaceholder",
          )}
          options={locationPrecisionOptionsTranslated}
          name="locationPrecision"
          value={listing.locationPrecision}
        />
      </div>
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="coordinates">
            {t("listing.new.progress.steps.location.map.coordinates")}
          </Label>
        </div>
        <p className="text-xs leading-3 text-gray-500">
          {t("listing.new.progress.steps.location.map.howToFindCoordinates")}
        </p>

        <Input
          value={coordinatesAsText}
          placeholder={t(
            "listing.new.progress.steps.location.map.coordinatesPlaceholder",
          )}
          onChange={(e) => {
            setCoordinatesAsText(
              e.target.value.replace(/\s/g, "").replace(/\(|\)/g, ""),
            );
          }}
          name="coordinates"
          id="coordinates"
          type="text"
        />
        <Button
          variant="outline"
          onClick={(e) => {
            const value = coordinatesAsText;
            const coordinatesRegex = /^-?\d+\.\d+,-?\d+\.\d+$/;
            if (coordinatesRegex.test(value)) {
              const [lat, lng] = value.split(",");
              const latRounded = roundToNearest6(parseFloat(lat));
              const lngRounded = roundToNearest6(parseFloat(lng));
              setPinLocation({
                lat: latRounded,
                lng: lngRounded,
              });
              setCoordinatesAsText(
                latRounded.toString() + "," + lngRounded.toString(),
              );
            } else {
              alert("Invalid coordinates");
            }
          }}
          type="button"
          size={"default"}
          className="h-auto text-sm text-blue-600"
        >
          {t("listing.new.progress.steps.location.map.applyCoordinates")}
        </Button>
      </div>

      <Separator className="my-4" />

      <ConfirmLocation
        pinLocation={pinLocation}
        setPinLocation={setPinLocation}
        place={place}
        municipality={municipality}
      />
    </div>
  );
}
