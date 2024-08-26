import { useFilters } from "@/hooks/useFilters";
import { ToggleGroupDemo } from "../../ToggleGroupDemo";
import { AirVentIcon, AlertCircle, Plus } from "lucide-react";

const internalFeaturesOptions = [
  {
    label: (
      <>
        <AirVentIcon /> AC
      </>
    ),
    value: "ac",
  },
  {
    label: (
      <>
        <Plus /> Storage
      </>
    ),
    value: "storage",
  },
  {
    label: (
      <>
        <Plus /> Garage
      </>
    ),
    value: "garage",
  },
  {
    label: (
      <>
        <AlertCircle /> Alarm
      </>
    ),
    value: "alarm",
  },
  {
    label: (
      <>
        <AlertCircle /> Fancy Art
      </>
    ),
    value: "fancy_art",
  },
  {
    label: (
      <>
        <AlertCircle /> Tito furniture
      </>
    ),
    value: "tito_furniture",
  },
  {
    label: (
      <>
        <AlertCircle /> Cat
      </>
    ),
    value: "cat",
  },
];

export default function InternalFeaturesFilter() {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold leading-6 flex">
        Internal Features
      </div>
      <div className="flex items-center gap-3  ">
        <ToggleGroupDemo
          type="multiple"
          options={internalFeaturesOptions}
          value={filters.internalFeatures}
          onValueChange={(value: string[]) => {
            updateFilters({
              internalFeatures: value,
            });
          }}
        />
      </div>
    </div>
  );
}
