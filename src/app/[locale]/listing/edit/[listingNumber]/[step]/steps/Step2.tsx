"use client";
import { InputSelect } from "@/components/shared/InputSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useState } from "react";
import { Listing } from "@prisma/client";

import {
  getMunicipalityPlaces,
  municipalitiesOptions as municipalitiesOptionsData,
} from "@/lib/data/macedonia/importantData";
import { PopulatedPlace } from "@/lib/data/macedonia/macedoniaPopulatedPlaces";
import { MapPosition } from "../_components/mapHelpers";
import ConfirmLocation from "../_components/ConfirmLocation";
import MapPinSetup from "./MapPinSetup";

export default function Step2({ listing }: { listing: Listing }) {
  const [municipality, setMunicipality] = useState(listing.municipality);

  const [populatedPlace, setPopulatedPlace] = useState(listing.place);

  const [populatedPlacesOptions, setPopulatedPlacesOptions] = useState<
    { label: string; value: string }[]
  >(() => {
    if (listing.municipality) {
      const populatedPlaces = getMunicipalityPlaces(listing.municipality);
      if (populatedPlaces) {
        return populatedPlaces.map((o) => ({ label: o.name, value: o.id }));
      }
    }
    return [];
  });
  // const [district, setDistrict] = useState(listing.district);

  const [address, setAddress] = useState(listing.address);

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="2" name="step" />
      <h2 className="text-lg">Location</h2>
      <Separator className="my-2 mt-4" />
      <InputSelect
        label="Municipality"
        name="municipality"
        required
        onSelect={(municipalityId) => {
          console.log("municipality", municipalityId);
          setMunicipality(municipalityId);

          const populatedPlaces = getMunicipalityPlaces(municipalityId);
          if (populatedPlaces) {
            const ppOptions = populatedPlaces.map((o) => ({
              label: o.name,
              value: o.id,
            }));

            setPopulatedPlacesOptions(ppOptions);
            setPopulatedPlace(ppOptions[0].value);
          } else {
            setPopulatedPlacesOptions([]);
            setPopulatedPlace(null);
          }
        }}
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
        onSelect={(placeId) => {
          console.log("place", placeId);
          setPopulatedPlace(placeId);
        }}
        notFoundText="Place doesn't exist"
        placeholder="Select a place"
        defaultValue={populatedPlace}
        options={populatedPlacesOptions}
      />

      {/* We won't have districts in the beginning */}
      {/* <InputSelect
        name="district"
        label="District"
        required
        onSelect={(value) => setDistrict(value)}
        notFoundText="District doesn't exist"
        placeholder="Select a district"
        defaultValue={district}
        options={[{ label: "district1", value: "bs" }]}
      /> */}

      <Label htmlFor="address">
        Address <span className="text-base text-red-500">*</span>{" "}
      </Label>
      <Input
        required
        placeholder="Ex: Mile Pop Jordanov 28, Skopje 1000"
        name="address"
        id={"address"}
        value={address || ""}
        onChange={(e) => {
          setAddress(e.target.value);
        }}
      />
      <MapPinSetup
        listing={listing}
        municipality={municipality}
        populatedPlace={populatedPlace}
      />
    </div>
  );
}
