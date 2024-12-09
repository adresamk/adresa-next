"use client";

import { useState, useCallback, useEffect } from "react";
import { Listing } from "@prisma/client";
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
import { PopulatedPlace } from "@/lib/data/macedoniaOld/macedoniaPopulatedPlaces";
import {
  getMunicipalityInfo,
  getPlaceInfo,
} from "@/lib/data/macedoniaOld/importantData";
import { useTranslations } from "next-intl";

export default function MapPinSetup({
  listing,
  municipality,
  populatedPlace,
}: {
  listing: Listing;
  municipality: string | null;
  populatedPlace: string | null;
}) {
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const [usedPlaces, setUsedPlaces] = useState<{
    populatedPlace: PopulatedPlace | null;
    municipality: PopulatedPlace | null;
  }>({
    populatedPlace: null,
    municipality: null,
  });

  const t = useTranslations();

  const [coordinates, setCoordinates] = useState<string>(() => {
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
    if (municipality && populatedPlace) {
      const municipalityData = getMunicipalityInfo(municipality);
      const populatedPlaceData = getPlaceInfo(populatedPlace, municipality);
      setUsedPlaces({
        populatedPlace: populatedPlaceData ?? null,
        municipality: municipalityData ?? null,
      });
    }
  }, [municipality, populatedPlace]);

  return (
    <div className="mt-3">
      <h2 className="text-lg">
        {t("listing.new.progress.steps.location.map.confirmLocation")}
      </h2>
      <Separator className="my-2" />

      <p className="text-xs leading-3 text-gray-500">
        {t("listing.new.progress.steps.location.map.howToFindCoordinates")}
      </p>
      <Dialog>
        <DialogTrigger asChild className="mt-0">
          <Button
            variant="link"
            size={"sm"}
            className="h-auto p-0 text-sm text-blue-600"
          >
            {t("listing.new.progress.steps.location.map.seeExample")}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {t(
                "listing.new.progress.steps.location.map.howToFindCoordinates",
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {t(
                  "listing.new.progress.steps.location.map.instructions.description",
                )}
              </p>
              <ol className="list-decimal pl-4 text-sm text-gray-600">
                <li>
                  {t(
                    "listing.new.progress.steps.location.map.instructions.step1",
                  )}
                </li>
                <li>
                  {t(
                    "listing.new.progress.steps.location.map.instructions.step2",
                  )}
                </li>
                <li>
                  {t(
                    "listing.new.progress.steps.location.map.instructions.step3",
                  )}
                </li>
              </ol>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <img
                  src="/assets/coordinates-example-1.png"
                  alt="Right click on map"
                  className="max-h-[70vh] rounded-lg border"
                />
                <p className="text-center text-xs text-gray-500">
                  {t(
                    "listing.new.progress.steps.location.map.instructions.step4",
                  )}
                </p>
                <p className="text-center text-xs text-gray-500">
                  {t(
                    "listing.new.progress.steps.location.map.instructions.step5",
                  )}
                </p>
              </div>
              <div className="space-y-2">
                <img
                  src="/assets/coordinates-example-2.jpg"
                  alt="Copy coordinates"
                  className="max-h-[70vh] rounded-lg border"
                />
                <p className="text-center text-xs text-gray-500">
                  {t(
                    "listing.new.progress.steps.location.map.instructions.step6",
                  )}
                </p>
                <p className="text-center text-xs text-gray-500">
                  {t(
                    "listing.new.progress.steps.location.map.instructions.step7",
                  )}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Single input for latitude and longitude */}

      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="coordinates">
            {t("listing.new.progress.steps.location.map.coordinates")}
          </Label>
        </div>
        <Input
          value={coordinates}
          placeholder={t(
            "listing.new.progress.steps.location.map.coordinatesPlaceholder",
          )}
          onChange={(e) => {
            setCoordinates(
              e.target.value.replace(/\s/g, "").replace(/\(|\)/g, ""),
            );
          }}
          name="coordinates"
          id="coordinates"
          type="text"
        />
        <Button
          onClick={(e) => {
            const value = coordinates;
            const coordinatesRegex = /^-?\d+\.\d+,-?\d+\.\d+$/;
            if (coordinatesRegex.test(value)) {
              const [lat, lng] = value.split(",");
              setPinLocation({
                lat: roundToNearest6(parseFloat(lat)),
                lng: roundToNearest6(parseFloat(lng)),
              });
              setCoordinates(
                roundToNearest6(parseFloat(lat)).toString() +
                  "," +
                  roundToNearest6(parseFloat(lng)).toString(),
              );
            } else {
              alert("Invalid coordinates");
            }
          }}
          variant="ghost"
          type="button"
          size={"default"}
          className="h-auto text-sm text-blue-600"
        >
          {t("listing.new.progress.steps.location.map.applyCoordinates")}
        </Button>
      </div>
      {/* <div className="invisible h-0 overflow-hidden">
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="latitude">Latitude</Label>
          </div>
          <Input
            value={pinLocation?.lat}
            onChange={() => {}}
            disabled
            placeholder="41.9981"
            name="latitude"
            id="latitude"
            type="text"
            inputMode="decimal"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            disabled
            onChange={() => {}}
            value={pinLocation?.lng}
            placeholder="21.4254"
            name="longitude"
            id="longitude"
            type="text"
            inputMode="decimal"
          />
        </div>
      </div> */}

      <Separator className="my-4" />

      <ConfirmLocation
        populatedPlace={usedPlaces.populatedPlace}
        municipality={usedPlaces.municipality}
        pinCoordinates={pinLocation}
        setPinCoordinates={setPinLocation}
      />
    </div>
  );
}
