import { useFilters } from "@/hooks/useFilters";
import { ToggleGroupDemo } from "../../ToggleGroupDemo";
import {
  AirVentIcon,
  AlertCircle,
  Calendar,
  Plus,
} from "lucide-react";
import { SelectDemo } from "../../SelectDemo";

const timeRangeOptions = [
  {
    label: "Any",
    value: "any",
  },
  {
    label: "24h",
    value: "24h",
  },
  {
    label: "3d",
    value: "3d",
  },
  {
    label: "7d",
    value: "7d",
  },
  {
    label: "30d",
    value: "30d",
  },
];

const extraTimeRangeOptions = [
  {
    label: "6 months",
    value: "6m",
  },
  {
    label: "1 year",
    value: "1y",
  },
];

export default function LastUpdatedFilter() {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold leading-6 flex">
        <Calendar /> Last Update
      </div>
      <div className="flex items-center gap-3 ">
        <ToggleGroupDemo
          type="single"
          options={timeRangeOptions}
          value={
            filters.lastUpdated === "" ? "any" : filters.lastUpdated
          }
          onValueChange={(value: string) => {
            updateFilters({
              lastUpdated: value === "any" ? "" : value,
            });
          }}
        />

        <SelectDemo
          name="lastUpdated"
          value={
            timeRangeOptions
              .map((o) => o.value)
              .includes(filters.lastUpdated)
              ? ""
              : filters.lastUpdated
          }
          placeholder="Other"
          onClick={(value) => {
            updateFilters({
              lastUpdated: value,
            });
          }}
          options={extraTimeRangeOptions}
        />
      </div>
    </div>
  );
}
