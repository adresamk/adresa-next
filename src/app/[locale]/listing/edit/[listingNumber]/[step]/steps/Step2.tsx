"use client";
import { InputSelect } from "@/components/shared/InputSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Listing } from "@prisma/client";

("@/global/data");
// import MapConfirmLocation from "../_components/MapConfirmLocation";
import {
  getMunicipalityPlaces,
  municipalitiesOptions as municipalitiesOptionsData,
} from "@/lib/data/macedonia/importantData";
import { PopulatedPlace } from "@/lib/data/macedonia/macedoniaPopulatedPlaces";
import ConfirmLocation from "../_components/ConfirmLocation";
interface Location {
  lat: number;
  lng: number;
}
const municipalitiesOptions = municipalitiesOptionsData.map((o) => ({
  label: o.name,
  value: o.id,
}));

export default function Step2({ listing }: { listing: Listing }) {
  const [municipality, setMunicipality] = useState(listing.municipality);
  const [populatedPlace, setPopulatedPlace] = useState(listing.place);
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
  const [pinLocation, setPinLocation] = useState<Location | null>(() => {
    if (!listing.latitude || !listing.longitude) {
      return null;
    }
    return {
      lat: listing.latitude,
      lng: listing.longitude,
    };
  });

  // Single effect to handle municipality changes
  useEffect(() => {
    if (municipality) {
      const municipalityData = municipalitiesOptionsData.find(
        (m) => m.id === municipality,
      );

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
        onSelect={(value) => setMunicipality(value)}
        notFoundText="Municipality doesn't exist"
        placeholder="Select a Municipality"
        defaultValue={municipality}
        options={municipalitiesOptions}
      />
      <InputSelect
        name="place"
        label="City/Village/Region"
        required
        onSelect={(value) => setPopulatedPlace(value)}
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
        value={pinLocation ? pinLocation.lat : ""}
        onChange={(e) => {
          setPinLocation({
            ...pinLocation,
            lat: parseFloat(parseFloat(e.target.value).toFixed(5)),
            lng: pinLocation ? pinLocation.lng : 0,
          });
        }}
        placeholder="Your latitude"
        name="latitude"
        id={"latitude"}
      />

      <Label htmlFor="longitude">longitude</Label>
      <Input
        onChange={(e) => {
          setPinLocation({
            ...pinLocation,
            lng: parseFloat(parseFloat(e.target.value).toFixed(5)),
            lat: pinLocation ? pinLocation.lat : 0,
          });
        }}
        placeholder="Your longitude"
        value={pinLocation ? pinLocation.lng : ""}
        name="longitude"
        id={"longitude"}
      />

      <Separator className="my-2" />
      {/* <MapDemo /> */}
      <ConfirmLocation
        municipality={usedPlaces.municipality}
        populatedPlace={usedPlaces.populatedPlace}
        pinLocation={pinLocation}
        setPinLocation={setPinLocation}
      />
    </div>
  );
}
