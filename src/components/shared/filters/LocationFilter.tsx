import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { locationDropdownOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilters } from "@/hooks/useFilters";
import { useSelectedFilter } from "@/hooks/useSelectedFilter";
import { Button } from "@/components/ui/button";

function BigVariant() {
  const focusedFilter = useSelectedFilter(
    (store) => store.selectedFilter
  );

  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter
  );
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);

  //focus field on selection of the space around it for location
  // useEffect(() => {
  //   if (focusedFilter === "location") {
  //     document.getElementById("location")?.focus();
  //   }
  // }, [focusedFilter]);

  return (
    <div
      className={cn(
        " flex-1 flex-grow  p-4  border-r rounded border-r-black overflow-visible h-[90px] min-w-[418px] w-full ",
        focusedFilter === "location" &&
          "shadow-lg bg-white rounded-t z-10",
        !focusedFilter && "bg-gray-50 "
      )}
      onClick={() => {
        setFocusedFilter("location");
        document.getElementById("location")?.focus();
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
                focusedFilter === "location"
                  ? "Type at least 3 characters"
                  : "e.g. Skopje, Kumanovo, Veles"
              }
              value={filters.location}
              onChange={(e) => {
                updateFilters({ location: e.target.value });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface LocationFilterProps {
  variant: "homepage" | "search";
}
export default function LocationFilter({
  variant,
}: LocationFilterProps) {
  const locationFilterDivRef = useRef(null);
  const focusedFilter = useSelectedFilter(
    (store) => store.selectedFilter
  );
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  const [isOpen, setisOpen] = useState(false);

  //effect description
  useEffect(() => {
    if (filters.location.length >= 3) {
      setisOpen(true);
    } else {
      setisOpen(false);
    }
  }, [filters.location]);
  const handleClickOutside = () => {
    setisOpen(false);
  };
  useOnClickOutside(locationFilterDivRef, handleClickOutside);
  return (
    <div ref={locationFilterDivRef}>
      <Popover
        open={isOpen}
        onOpenChange={(nextState) => {
          if (nextState === true && filters.location.length >= 3) {
            setisOpen(true);
          }
        }}
      >
        <PopoverTrigger>
          {variant === "homepage" ? <BigVariant /> : <div>small</div>}
        </PopoverTrigger>
        <PopoverContent asChild>
          {focusedFilter === "location" && (
            <ul className=" w-full min-w-[418px] flex flex-col p-2 max-h-[280px] overflow-y-auto relative text-sm bg-white rounded   shadow-lg">
              {locationDropdownOptions.map((location) => (
                <li
                  key={location}
                  className={cn(
                    "p-1  hover:bg-green-50 cursor-pointer rounded flex gap-2",
                    filters.propertyType === location &&
                      "bg-green-50 text-brand-dark-blue"
                  )}
                  onClick={() => {
                    updateFilters({ location });
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
    </div>
  );
}
