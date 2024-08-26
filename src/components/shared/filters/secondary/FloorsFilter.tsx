import { ArrowsUpFromLine } from "lucide-react";
import { SelectDemo } from "../../SelectDemo";
import { useFilters } from "@/hooks/useFilters";
export const floorNumberOptions = [
  { label: "Any", value: "any" },
  { label: "Basement", value: "basement" },
  { label: "Mezanine", value: "mezanine" },
  { label: "Ground floor", value: "ground_floor" },
  { label: "Attic", value: "attic" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10-14", value: "10-14" },
  { label: "15-19", value: "15-19" },
  { label: "20-29", value: "20-29" },
  { label: "30-39", value: "30-39" },
  { label: "40-49", value: "40-49" },
  { label: "50+", value: "50+" },
];
export default function FloorsFilter() {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold leading-6 flex">
        <ArrowsUpFromLine className="mr-2" /> Floor
      </div>
      <div className="flex items-center gap-3">
        <SelectDemo
          name="floorNumberLow"
          value={filters.floorNumberLow}
          placeholder="From"
          onClick={(value) => {
            updateFilters({
              floorNumberLow: value === "any" ? "" : value,
            });
          }}
          options={floorNumberOptions}
        />
        <span className="">-</span>
        <SelectDemo
          name="floorNumberHigh"
          value={filters.floorNumberHigh}
          placeholder="From"
          onClick={(value) => {
            updateFilters({
              floorNumberHigh: value === "any" ? "" : value,
            });
          }}
          options={floorNumberOptions}
        />
      </div>
    </div>
  );
}
