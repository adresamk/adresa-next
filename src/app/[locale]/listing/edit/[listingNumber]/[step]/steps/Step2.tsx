"use client";
import { InputSelect } from "@/components/shared/InputSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useState } from "react";
import { Listing } from "@prisma/client";

// "@/global/data";
// import MapConfirmLocation from "../_components/MapConfirmLocation";
import {
  getMunicipalityPlaces,
  municipalitiesOptions as municipalitiesOptionsData,
} from "@/lib/data/macedonia/importantData";
import { PopulatedPlace } from "@/lib/data/macedonia/macedoniaPopulatedPlaces";
import { MapPosition } from "../_components/mapHelpers";
import ConfirmLocation from "../_components/ConfirmLocation";

interface Location {
  lat: number;
  lng: number;
}

export default function Step2({ listing }: { listing: Listing }) {
  const [municipality, setMunicipality] = useState(listing.municipality);
  const [populatedPlace, setPopulatedPlace] = useState(listing.place);
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const [usedPlaces, setUsedPlaces] = useState<{
    populatedPlace: PopulatedPlace | null;
    municipality: PopulatedPlace | null;
  }>({
    populatedPlace: null,
    municipality: null,
  });

  const [populatedPlacesOptions, setPopulatedPlacesOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [district, setDistrict] = useState(listing.district);

  const [address, setAddress] = useState(listing.address);
  const [pinCoordinates, setPinCoordinates] = useState<MapPosition | null>(() => {
    if (!listing.latitude || !listing.longitude) {
      return null;
    }
    return {
      lat: listing.latitude,
      lng: listing.longitude,
    };
  });

  const [tempCoordinates, setTempCoordinates] = useState<{ lat: string; lng: string }>({
    lat: pinCoordinates ? pinCoordinates.lat.toString() : "",
    lng: pinCoordinates ? pinCoordinates.lng.toString() : "",
  });

  // Debounced function to update pinCoordinates
  const updatePinCoordinates = useCallback((field: "lat" | "lng", value: string) => {
    if (value === "" || value === "." || value === "-" || value === "-." || value === "-.") {
      return; // Don't update pinCoordinates for these intermediate values
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setPinCoordinates((prev) => {
        const newCoords: MapPosition = {
          lat: field === "lat" ? parseFloat(numValue.toFixed(5)) : (prev?.lat ?? 0),
          lng: field === "lng" ? parseFloat(numValue.toFixed(5)) : (prev?.lng ?? 0),
        };
        return newCoords;
      });
    }
  }, []);

  // Handle immediate input changes
  const handleCoordinateChange = (field: "lat" | "lng", value: string) => {
    setTempCoordinates((prev) => ({ ...prev, [field]: value }));
    updatePinCoordinates(field, value);
  };

  // Update temp coordinates when pinCoordinates changes externally
  useEffect(() => {
    if (pinCoordinates) {
      setTempCoordinates({
        lat: pinCoordinates.lat.toString(),
        lng: pinCoordinates.lng.toString(),
      });
    }
  }, [pinCoordinates]);

  const handleAreaChange = (newArea: string, type: "municipality" | "place") => {
    if (type === "municipality") {
      setMunicipality(newArea);
    } else {
      setPopulatedPlace(newArea);
    }
  };

  // Single effect to handle municipality changes
  useEffect(() => {
    if (municipality) {
      const municipalityData = municipalitiesOptionsData.find((m) => m.id === municipality);

      if (municipalityData) {
        const places = getMunicipalityPlaces(municipalityData.id);
        if (places) {
          const populatedPlacesOptions = places.map((p) => ({
            label: p.name,
            value: p.id,
          }));

          setPopulatedPlacesOptions(populatedPlacesOptions);
          setUsedPlaces({
            municipality: municipalityData,
            populatedPlace: places[0], // Set default to first place
          });
          setPopulatedPlace(populatedPlacesOptions[0].value);
        }
      }
    }
  }, [municipality]);

  // Effect to update selected place
  useEffect(() => {
    if (usedPlaces.municipality?.id && populatedPlace) {
      const places = getMunicipalityPlaces(usedPlaces.municipality.id);
      if (places) {
        const selectedPlace = places.find((p) => p.id === populatedPlace);
        if (selectedPlace) {
          setUsedPlaces((prev) => ({
            ...prev,
            populatedPlace: selectedPlace,
          }));
        }
      }
    }
  }, [populatedPlace, usedPlaces.municipality]);

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="2" name="step" />
      <h2 className="text-lg">Location</h2>
      <Separator className="my-2 mt-4" />
      <InputSelect
        label="Municipality"
        name="municipality"
        required
        onSelect={(value) => handleAreaChange(value, "municipality")}
        notFoundText="Municipality doesn't exist"
        placeholder="Select a Municipality"
        defaultValue={municipality}
        options={municipalitiesOptionsData.map((o) => ({
          label: o.name,
          value: o.id,
        }))}
      />
      <InputSelect
        name="place"
        label="City/Village/Region"
        required
        onSelect={(value) => handleAreaChange(value, "place")}
        notFoundText="Place doesn't exist"
        placeholder="Select a place"
        defaultValue={populatedPlace}
        options={populatedPlacesOptions}
      />

      <InputSelect
        name="district"
        label="District"
        required
        onSelect={(value) => setDistrict(value)}
        notFoundText="District doesn't exist"
        placeholder="Select a district"
        defaultValue={district}
        options={[{ label: "district1", value: "bs" }]}
      />

      <Label htmlFor="address">
        Address <span className="text-base text-red-500">*</span>{" "}
      </Label>
      <Input
        required
        placeholder="Your address"
        name="address"
        id={"address"}
        value={address || ""}
        onChange={(e) => {
          setAddress(e.target.value);
        }}
      />

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
      <ConfirmLocation
        municipality={usedPlaces.municipality}
        populatedPlace={usedPlaces.populatedPlace}
        pinCoordinates={pinCoordinates}
        setPinCoordinates={setPinCoordinates}
      />
    </div>
  );
}
