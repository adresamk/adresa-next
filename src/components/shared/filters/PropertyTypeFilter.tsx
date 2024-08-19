import { cn } from "@/lib/utils";
import { SearchFormFilterProps } from "./filter-types";
import { House } from "lucide-react";
import { propertyTypes } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
export default function PropertyTypeFilter({
  selectedFilter,
  setSelectedFilter,
  filters,
  setFilters,
}: SearchFormFilterProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={cn(
            "p-4  border-r border-r-black overflow-visible h-[90px] w-[185px] ",
            selectedFilter === "property-type" &&
              "shadow-lg bg-white rounded-t z-10",
            !selectedFilter && "bg-gray-50 "
          )}
          onClick={() => {
            setSelectedFilter("property-type");
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
      </PopoverTrigger>
      <PopoverContent>
        <ul className=" w-[184px] p-2 top-[4px] relative text-sm -left-4 bg-white rounded rounded-t-none  shadow-lg">
          {propertyTypes.map((type) => (
            <li
              key={type}
              className={cn(
                "px-2 py-1 hover:bg-green-50 cursor-pointer rounded",
                filters.propertyType === type &&
                  "bg-green-50 text-brand-dark-blue"
              )}
              onClick={() => {
                setFilters((prev: any) => ({
                  ...prev,
                  propertyType: type,
                }));
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
