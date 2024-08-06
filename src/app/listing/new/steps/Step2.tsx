import { InputSelect } from "@/components/shared/InputSelect";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const cities = [
  { label: "Kumanovo", value: "kumanovo" },
  { label: "Skopje", value: "skopje" },
];

export default function Step2() {
  const value = "kumanovo";
  const [city, setCity] = useState(value);
  return (
    <div className="p-2">
      <h2 className="text-lg">Location</h2>
      <Separator className="my-2 mt-4" />
      <div className="flex gap-2">
        <InputSelect
          onSelect={(value) => setCity(value)}
          notFoundText="City doesn't exist"
          placeholder="Select a city"
          defaultValue={city}
          options={cities}
        />
        {/* <InputDemo title="Country" /> */}
        {/* <InputDemo title="City" /> */}
      </div>
      <div className="flex gap-2">
        {/* <InputDemo title="Street" /> */}
        {/* <InputDemo title="Number" /> */}
      </div>
      <div className="flex gap-2">
        {/* <InputDemo title="Zip Code" />
        <InputDemo title="Neighborhood" /> */}
      </div>
      <Separator className="my-2" />
      <h2 className="text-lg">Map</h2>
      {/* <MapDemo /> */}
    </div>
  );
}
