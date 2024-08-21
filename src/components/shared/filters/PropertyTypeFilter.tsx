import { cn } from "@/lib/utils";
import { House } from "lucide-react";
import { propertyTypes } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelectedFilter } from "@/hooks/useSelectedFilter";
import { useFilters } from "@/hooks/useFilters";
import { propertyTypeValues } from "@/lib/types";
function BigVariant() {
  const focusedFilter = useSelectedFilter(
    (store) => store.selectedFilter
  );

  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter
  );
  const filters = useFilters((store) => store.filters);

  return (
    <div
      className={cn(
        "p-4  border-r border-r-black overflow-visible h-[90px] w-[185px] ",
        focusedFilter === "property-type" &&
          "shadow-lg bg-white rounded-t z-10",
        !focusedFilter && "bg-gray-50 "
      )}
      onClick={() => {
        setFocusedFilter("property-type");
      }}
    >
      <div className="">
        <div className="flex flex-col gap-1.5 text-brand-dark-blue">
          <label
            className="h-5 flex w-full gap-2 items-center"
            htmlFor={"property-type"}
          >
            {<House size={22} />} {"Property Type"}
          </label>
          <div className="text-sm h-10 flex items-center">
            {filters.propertyType || (
              <span className="text-gray-400">Home</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
interface PropertyTypeFilterProps {
  variant: "homepage" | "search";
}
export default function PropertyTypeFilter({
  variant,
}: PropertyTypeFilterProps) {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);

  return (
    <Popover>
      <PopoverTrigger>
        {variant === "homepage" ? <BigVariant /> : <div>small</div>}
      </PopoverTrigger>
      <PopoverContent>
        <ul className=" w-[184px] p-2 top-[4px] relative text-sm -left-4 bg-white rounded rounded-t-none  shadow-lg">
          {propertyTypes.map((type: propertyTypeValues) => (
            <li
              key={type}
              className={cn(
                "px-2 py-1 hover:bg-green-50 cursor-pointer rounded",
                filters.propertyType === type &&
                  "bg-green-50 text-brand-dark-blue"
              )}
              onClick={() => {
                updateFilters({ propertyType: type });
              }}
            >
              {type}
            </li>
          ))}
        </ul>
      </PopoverContent>{" "}
    </Popover>
  );
}
