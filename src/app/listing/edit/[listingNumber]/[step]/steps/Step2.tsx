"use client";
import { InputSelect } from "@/components/shared/InputSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Listing } from "@prisma/client";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import {
  districts,
  manucipalities,
  populatedPlaces,
} from "@/global/data";
import { createSlug } from "@/lib/utils";

const districtOptions = districts.map((district) => ({
  label: district,
  value: createSlug(district),
}));

const manucipalityOptions = manucipalities.map((manucipality) => ({
  label: manucipality,
  value: createSlug(manucipality),
}));

const populatedPlaceOptions = populatedPlaces.map((place) => ({
  label: place,
  value: createSlug(place),
}));

export default function Step2({ listing }: { listing: Listing }) {
  const [manucipality, setManucipality] = useState(
    listing.manucipality
  );
  const [populatedPlace, setPopulatedPlace] = useState(listing.place);

  const [district, setDistrict] = useState(listing.district);

  const [address, setAddress] = useState(listing.address);
  const position = [51.505, -0.09];

  return (
    <div className="p-2">
      <input
        type="string"
        className="hidden"
        defaultValue="2"
        name="step"
      />
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
        options={manucipalityOptions}
      />
      <InputSelect
        name="place"
        label="City/Village/Region"
        required
        onSelect={(value) => setPopulatedPlace(value)}
        notFoundText="Place doesn't exist"
        placeholder="Select a place"
        defaultValue={populatedPlace}
        options={populatedPlaceOptions}
      />

      <InputSelect
        name="district"
        label="District"
        required
        onSelect={(value) => setDistrict(value)}
        notFoundText="District doesn't exist"
        placeholder="Select a district"
        defaultValue={district}
        options={districtOptions}
      />

      <Label htmlFor="address">
        Address <span className="text-red-500 text-base">*</span>{" "}
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
        defaultValue={listing.latitude || ""}
        placeholder="Your latitude"
        name="latitude"
        id={"latitude"}
      />

      <Label htmlFor="longitude">longitude</Label>
      <Input
        placeholder="Your longitude"
        defaultValue={listing.longitude || ""}
        name="longitude"
        id={"longitude"}
      />

      {/* <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer> */}

      <Separator className="my-2" />
      {/* <MapDemo /> */}
    </div>
  );
}
