import { useState } from "react";
import { SearchFormFilterProps } from "./filter-types";
import { MapPin } from "lucide-react";
import { locationDropdownOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function LocationFilter({
  selectedFilter,
  setSelectedFilter,
  filters,
  setFilters,
}: SearchFormFilterProps) {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  return (
    <Popover>
      <PopoverTrigger>
        {" "}
        <div
          className={cn(
            " flex-1 flex-grow  p-4  border-r rounded border-r-black overflow-visible h-[90px] min-w-[418px] w-full ",
            selectedFilter === "location" &&
              "shadow-lg bg-white rounded-t z-10",
            !selectedFilter && "bg-gray-50 "
          )}
          onClick={() => {
            setSelectedFilter("location");
          }}
        >
          <div className="w-full">
            <div className="  flex flex-col gap-1.5 text-brand-dark-blue">
              <label
                className=" h-5 flex w-full gap-2 items-center"
                htmlFor={"location"}
              >
                {<MapPin size={22} />} {"Location"}
              </label>
              <div className="text-sm h-10 flex items-center">
                {/* line-height: 1; border: 0; height: 40px; padding: 0;
              flex-grow: 1; letter-spacing: -.32px; */}
                <input
                  className=" h-8 w-full flex-grow border-none rounded leading-tight p-1 px-4 text-black outline-none bg-gray-50"
                  name="location"
                  id="location"
                  placeholder={
                    selectedFilter === "location"
                      ? "Type at least 3 characters"
                      : "e.g. Skopje, Kumanovo, Veles"
                  }
                  value={filters.location}
                  onChange={(e) => {
                    setFilters((prev: any) => ({
                      ...prev,
                      location: e.target.value,
                    }));
                    if (e.target.value.length >= 3) {
                      setSuggestionsOpen(true);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>{" "}
      </PopoverTrigger>{" "}
      <PopoverContent>
        {selectedFilter === "location" && suggestionsOpen && (
          <ul className=" w-full flex flex-col p-2 top-[5px] max-h-[280px] overflow-y-auto relative text-sm -left-4 bg-white rounded rounded-t-none  shadow-lg">
            {locationDropdownOptions.map((location) => (
              <li
                key={location}
                className={cn(
                  "px-2 py-1 hover:bg-green-50 cursor-pointer rounded flex gap-2",
                  filters.propertyType === location &&
                    "bg-green-50 text-brand-dark-blue"
                )}
                onClick={() => {
                  setFilters((prev: any) => ({
                    ...prev,
                    location: location,
                  }));
                  setSuggestionsOpen(false);
                }}
              >
                <span>
                  <MapPin />
                </span>
                <span>{location}</span>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
