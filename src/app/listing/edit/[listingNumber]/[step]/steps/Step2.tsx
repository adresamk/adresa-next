"use client";
import { InputSelect } from "@/components/shared/InputSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Listing } from "@prisma/client";
import {
  districts,
  districtsOptions,
  manucipalities,
  manucipalitiesOptions,
  populatedPlaces,
  populatedPlacesOptions,
} from "@/global/data";
import { createSlug } from "@/lib/utils";
import { LatLngExpression } from "leaflet";
import MapConfirmLocation from "../_components/MapConfirmLocation";
import { randomSkopjeCoordinates } from "@/global/dataa";
interface Location {
  lat: number;
  lng: number;
}
export default function Step2({ listing }: { listing: Listing }) {
  const [manucipality, setManucipality] = useState(listing.manucipality);
  const [populatedPlace, setPopulatedPlace] = useState(listing.place);

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

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="2" name="step" />
      <h2 className="text-lg">Location</h2>
      <Separator className="my-2 mt-4" />
      <InputSelect
        label="Manucipality"
        name="manucipality"
        required
        onSelect={(value) => setManucipality(value)}
        notFoundText="Manucipality doesn't exist"
        placeholder="Select a Manucipality"
        defaultValue={manucipality}
        options={manucipalitiesOptions}
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
