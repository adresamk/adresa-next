import { useFilters } from "@/hooks/useFilters";
import { ToggleGroupDemo } from "../../ToggleGroupDemo";
import { Armchair } from "lucide-react";

const furnitureOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];
export default function FurnitureFilter() {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold leading-6 flex">
        <Armchair className="mr-2" /> Furniture Included
      </div>
      <div className="flex items-center gap-3">
        <ToggleGroupDemo
          type="single"
          options={furnitureOptions}
          value={filters.isFurnitureIncluded ? "yes" : "no"}
          onValueChange={(value: string) => {
            updateFilters({
              isFurnitureIncluded: value === "yes" ? true : false,
            });
          }}
        />
      </div>
    </div>
  );
}
