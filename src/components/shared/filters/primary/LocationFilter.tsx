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
import { useTranslations } from "next-intl";

function BigVariant({ isOpen }: { isOpen: boolean }) {
  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);
  const t = useTranslations();

  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter,
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
        "relative h-[88px] w-full max-w-full rounded-xl border border-transparent pb-[6px] pl-[20px] pr-[19px] pt-[17px]",
        focusedFilter === "location" && "rounded-b-none",
        !focusedFilter && "bg-gray-50",
      )}
      onClick={() => {
        setFocusedFilter("location");
        document.getElementById("location")?.focus();
      }}
    >
      <div
        className={cn(
          "flex flex-col gap-1.5 text-brand-dark-blue",
          focusedFilter === "location" && "rounded-b-none",
        )}
      >
        <label
          className="flex h-5 w-full items-center gap-2"
          htmlFor={"location"}
        >
          {<MapPin className="h-4 w-4" />} {t("common.filters.location.label")}
        </label>
        <div className="relative flex h-10 items-center text-sm">
          {/* line-height: 1; border: 0; height: 40px; padding: 0;
      flex-grow: 1; letter-spacing: -.32px; */}
          <input
            autoComplete="off"
            // className="h-8 w-full flex-grow rounded border-none bg-gray-50 p-1 px-4 leading-tight text-black outline-none"
            className="h-[40px] flex-grow border-none bg-transparent p-0 leading-tight outline-none"
            style={{
              width: 0,
              flexBasis: 0,
            }}
            name="location"
            id="location"
            placeholder={
              focusedFilter === "location"
                ? t("common.filters.location.notActivePlaceholder")
                : t("common.filters.location.emptyPlaceholder")
            }
            value={filters.location}
            onChange={(e) => {
              updateFilters({ location: e.target.value });
            }}
          />
          {focusedFilter === "location" && isOpen && (
            <ul className="absolute left-0 top-full z-[100] -ml-[22px] mt-[5px] max-h-[280px] w-[calc(100%_+_41px)] overflow-auto rounded-b-xl bg-white shadow-lg">
              {locationDropdownOptions.map((location) => (
                <li
                  key={location}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded p-1 px-3 py-2 hover:bg-green-50",
                    filters.propertyType === location &&
                      "bg-green-50 text-brand-dark-blue",
                  )}
                  onClick={() => {
                    updateFilters({ location });
                  }}
                >
                  <span>
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span>{location}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

interface LocationFilterProps {
  variant: "homepage" | "search";
}
export default function LocationFilter({ variant }: LocationFilterProps) {
  const locationFilterDivRef = useRef(null);
  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);
  const filters = useFilters((store) => store.filters);
  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter,
  );
  const updateFilters = useFilters((store) => store.updateFilters);
  const [isOpen, setisOpen] = useState(false);

  //effect description
  useEffect(() => {
    // if (filters.location.length >= 0) {
    //   setisOpen(true);
    // } else {
    //   setisOpen(false);
    // }
  }, [filters.location]);
  const handleClickOutside = () => {
    setisOpen(false);
    setFocusedFilter("");
  };
  useOnClickOutside(locationFilterDivRef, handleClickOutside);
  return (
    <div
      ref={locationFilterDivRef}
      onClick={() => {
        setisOpen(true);
      }}
      className={cn(
        "location relative w-full flex-grow rounded-xl xl:w-auto xl:flex-1",
      )}
    >
      {/* <div>{isOpen ? "is" : "|"}</div> */}
      <div
        className={cn(
          "filters-field relative h-full w-full max-w-full rounded-xl border border-slate-200",
          focusedFilter === "location" &&
            "z-[20] rounded-b-none border-b-white bg-white",
        )}
      >
        <Popover
          open={isOpen}
          onOpenChange={(nextState) => {
            if (nextState === true) {
              setisOpen(true);
            }
          }}
        >
          <PopoverTrigger asChild>
            {variant === "homepage" ? (
              <BigVariant isOpen={isOpen} />
            ) : (
              <div>small</div>
            )}
          </PopoverTrigger>
          <PopoverContent asChild>
            {/* <ul className="test relative flex max-h-[280px] w-full min-w-[418px] flex-col overflow-y-auto rounded bg-white p-2 text-sm shadow-lg">
              {locationDropdownOptions.map((location) => (
                <li
                  key={location}
                  className={cn(
                    "flex cursor-pointer gap-2 rounded p-1 hover:bg-green-50",
                    filters.propertyType === location &&
                      "bg-green-50 text-brand-dark-blue",
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
            </ul> */}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
