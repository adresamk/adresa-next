import { Thermometer } from "lucide-react";
import { SelectDemo } from "../../SelectDemo";
import { useFilters } from "@/hooks/useFilters";

const heatingTypeOptions = [
  { label: "Any", value: "any" },
  { label: "Central", value: "central" },
  { label: "Electric", value: "electric" },
  { label: "Gas", value: "gas" },
  { label: "Geothermal", value: "geothermal" },
  { label: "Heat pump", value: "heat_pump" },
  { label: "Wood", value: "wood" },
  { label: "Solar", value: "solar" },
  { label: "Underfloor", value: "underfloor" },
  { label: "Other", value: "other" },
];
export default function HeatingTypeFilter() {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold leading-6 flex">
        <Thermometer className="mr-2" /> Heating
      </div>
      <div className="flex items-center gap-3">
        <SelectDemo
          name="heatingType"
          value={filters.heatingType}
          placeholder="Heating Type"
          onClick={(value) => {
            updateFilters({
              heatingType: value === "any" ? "" : value,
            });
          }}
          options={heatingTypeOptions}
        />
      </div>
    </div>
  );
}
