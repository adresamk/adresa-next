import { InputSelect } from "@/components/shared/InputSelect";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

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
  const [city, setCity] = useState("kumanovo");
  const [manucipality, setManucipality] = useState("ajducka-cesma");
  const [populatedPlace, setPopulatedPlace] = useState("dragomance");
  return (
    <div className="p-2">
      <h2 className="text-lg">Location</h2>
      <Separator className="my-2 mt-4" />
      <InputSelect
        label="City"
        required
        onSelect={(value) => setCity(value)}
        notFoundText="City doesn't exist"
        placeholder="Select a city"
        defaultValue={city}
        options={cities}
      />

      <InputSelect
        label="Manucipality"
        required
        onSelect={(value) => setManucipality(value)}
        notFoundText="Manucipality doesn't exist"
        placeholder="Select a Manucipality"
        defaultValue={manucipality}
        options={manucipalities}
      />

      <InputSelect
        label="Populated Place"
        required
        onSelect={(value) => setPopulatedPlace(value)}
        notFoundText="Populated Place doesn't exist"
        placeholder="Select a Populated Place"
        defaultValue={populatedPlace}
        options={populatedPlaces}
      />

      <Separator className="my-2" />
      <h2 className="text-lg">Map</h2>
      {/* <MapDemo /> */}
    </div>
  );
}
