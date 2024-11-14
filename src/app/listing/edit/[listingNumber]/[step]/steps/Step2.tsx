"use client";
import { InputSelect } from "@/components/shared/InputSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Listing } from "@prisma/client";
import {
  districtsOptions,
  // manucipalitiesOptions,
  // manucipalitiesOptions,
} from "@/global/data";
import MapConfirmLocation from "../_components/MapConfirmLocation";
import {
  getMunicipalityPlaces,
  municipalitiesOptions as municipalitiesOptionsData,
} from "@/lib/data/macedonia/importantData";
interface Location {
  lat: number;
  lng: number;
}
const municipalitiesOptions = municipalitiesOptionsData.map((o) => ({
  label: o.name,
  value: o.name.toLowerCase(),
}));

export default function Step2({ listing }: { listing: Listing }) {
  const [municipality, setMunicipality] = useState(listing.manucipality);
  const [populatedPlace, setPopulatedPlace] = useState(listing.place);

  const [populatedPlacesOptions, setPopulatedPlacesOptions] = useState<
    { label: string; value: string }[]
  >(() => {
    if (municipality) {
      const municipalityUsed = municipalitiesOptionsData.find(
        (m) => m.name.toLowerCase() === municipality.toLowerCase(),
      );
      if (municipalityUsed) {
        const places = getMunicipalityPlaces(municipalityUsed.id);
        if (places) {
          const populatedPlacesOptions = places.map((p) => ({
            label: p.name,
            value: p.name.toLowerCase(),
          }));
          setPopulatedPlace(populatedPlacesOptions[0].value);
          return populatedPlacesOptions;
        }
      }
      return [];
    }
    return [];
  });
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
  //update places options when municipality changes
  useEffect(() => {
    if (municipality) {
      console.log(municipality);
      const municipalityUsed = municipalitiesOptionsData.find(
        (m) => m.name.toLowerCase() === municipality.toLowerCase(),
      );
      if (municipalityUsed) {
        const places = getMunicipalityPlaces(municipalityUsed.id);
        if (places) {
          const populatedPlacesOptions = places.map((p) => ({
            label: p.name,
            value: p.name.toLowerCase(),
          }));
          console.log(populatedPlacesOptions);
          setPopulatedPlacesOptions(populatedPlacesOptions);
        }
      }
    }
  }, [municipality]);
  //effect description
  useEffect(() => {
    setPopulatedPlace(populatedPlacesOptions[0].value);
  }, [populatedPlacesOptions]);
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
        options={districtsOptions}
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
      <MapConfirmLocation
        pinLocation={pinLocation}
        setPinLocation={setPinLocation}
      />
    </div>
  );
}
