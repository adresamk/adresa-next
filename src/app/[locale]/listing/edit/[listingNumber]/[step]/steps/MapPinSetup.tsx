"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPosition } from "../_components/mapHelpers";
import { Listing } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ConfirmLocation from "../_components/ConfirmLocation";

export default function MapPinSetup({ listing }: { listing: Listing }) {
  const [pinCoordinates, setPinCoordinates] = useState<MapPosition | null>(
    () => {
      if (!listing.latitude || !listing.longitude) {
        return null;
      }
      return {
        lat: listing.latitude,
        lng: listing.longitude,
      };
    },
  );
  const [tempCoordinates, setTempCoordinates] = useState<{
    lat: string;
    lng: string;
  }>({
    lat: pinCoordinates ? pinCoordinates.lat.toString() : "",
    lng: pinCoordinates ? pinCoordinates.lng.toString() : "",
  });

  const handleCoordinateChange = (field: "lat" | "lng", value: string) => {
    setTempCoordinates((prev) => ({ ...prev, [field]: value }));
    updatePinCoordinates(field, value);
  };

  // Debounced function to update pinCoordinates
  const updatePinCoordinates = useCallback(
    (field: "lat" | "lng", value: string) => {
      if (
        value === "" ||
        value === "." ||
        value === "-" ||
        value === "-." ||
        value === "-."
      ) {
        return; // Don't update pinCoordinates for these intermediate values
      }

      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setPinCoordinates((prev) => {
          const newCoords: MapPosition = {
            lat:
              field === "lat"
                ? parseFloat(numValue.toFixed(5))
                : (prev?.lat ?? 0),
            lng:
              field === "lng"
                ? parseFloat(numValue.toFixed(5))
                : (prev?.lng ?? 0),
          };
          return newCoords;
        });
      }
    },
    [],
  );

  // H

  // Update temp coordinates when pinCoordinates changes externally
  useEffect(() => {
    if (pinCoordinates) {
      setTempCoordinates({
        lat: pinCoordinates.lat.toString(),
        lng: pinCoordinates.lng.toString(),
      });
    }
  }, [pinCoordinates]);

  return (
    <div>
      <h2 className="text-lg">Confirm your location</h2>
      <Label htmlFor="latitude">latitude</Label>
      <Input
        value={tempCoordinates.lat}
        onChange={(e) => handleCoordinateChange("lat", e.target.value)}
        placeholder="Your latitude"
        name="latitude"
        id={"latitude"}
        type="text"
        inputMode="decimal"
      />

      <Label htmlFor="longitude">longitude</Label>
      <Input
        onChange={(e) => handleCoordinateChange("lng", e.target.value)}
        placeholder="Your longitude"
        value={tempCoordinates.lng}
        name="longitude"
        id={"longitude"}
        type="text"
        inputMode="decimal"
      />

      <Separator className="my-2" />
      {/* <MapDemo /> */}
      {/* <ConfirmLocation
        municipality={listing.municipality}
        populatedPlace={listing.place}
        pinCoordinates={pinCoordinates}
        setPinCoordinates={setPinCoordinates}
      /> */}
    </div>
  );
}
