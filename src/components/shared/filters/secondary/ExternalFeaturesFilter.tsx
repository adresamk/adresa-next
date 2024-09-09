import { useFilters } from "@/hooks/useFilters";
import { ToggleGroupDemo } from "../../ToggleGroupDemo";
import { Plus } from "lucide-react";

const externalFeaturesOptions = [
  {
    label: (
      <>
        <Plus /> Parking
      </>
    ),
    value: "parking",
  },
  {
    label: (
      <>
        <Plus /> Yard
      </>
    ),
    value: "yard",
  },
  {
    label: (
      <>
        <Plus /> Pool
      </>
    ),
    value: "pool",
  },
];

export default function ExternalFeaturesFilter() {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);

  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold leading-6 flex">
        External Features
      </div>
      <div className="flex items-center gap-3">
        <ToggleGroupDemo
          type="multiple"
          options={externalFeaturesOptions}
          value={filters.externalFeatures}
          onValueChange={(value: string[]) => {
            updateFilters({
              externalFeatures: value,
            });
          }}
        />
      </div>
    </div>
  );
}
