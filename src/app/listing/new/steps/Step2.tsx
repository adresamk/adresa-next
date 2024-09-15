import { InputSelect } from "@/components/shared/InputSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
const cities = [
  { label: "Kumanovo", value: "kumanovo" },
  { label: "Skopje", value: "skopje" },
];

const manucipalities = [
  { label: "Ajducka Cesma", value: "ajducka-cesma" },
  { label: "Tabanovce", value: "tabanovce" },
];

const populatedPlaces = [
  { label: "Oktomvriska", value: "oktrevol" },
  { label: "Dragomance", value: "dragomance" },
];

export default function Step2() {
  const [place, setPlace] = useState("kumanovo");
  const [manucipality, setManucipality] = useState("ajducka-cesma");
  const [populatedPlace, setPopulatedPlace] = useState("dragomance");

  const [address, setAddress] = useState("");
  const position = [51.505, -0.09];

  return (
    <div className="p-2">
      <input type="string" className="hidden" value="2" name="step" />
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
        options={manucipalities}
      />
      <InputSelect
        name="place"
        label="City"
        required
        onSelect={(value) => setPlace(value)}
        notFoundText="City doesn't exist"
        placeholder="Select a city"
        defaultValue={place}
        options={cities}
      />

      <InputSelect
        name="district"
        label="Populated Place"
        required
        onSelect={(value) => setPopulatedPlace(value)}
        notFoundText="Populated Place doesn't exist"
        placeholder="Select a Populated Place"
        defaultValue={populatedPlace}
        options={populatedPlaces}
      />

      <Label htmlFor="address">Address</Label>
      <Input
        placeholder="Your address"
        name="address"
        id={"address"}
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
        }}
      />

      <h2 className="text-lg">Confirm your location</h2>

      <Label htmlFor="longitude">longitude</Label>
      <Input
        placeholder="Your longitude"
        name="longitude"
        id={"longitude"}
      />

      <Label htmlFor="latitude">latitude</Label>
      <Input
        placeholder="Your latitude"
        name="latitude"
        id={"latitude"}
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
