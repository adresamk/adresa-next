"use client";
import { cn } from "@/lib/utils";
import { ChevronDown, Tag } from "lucide-react";
import { areaFilterOptions } from "@/lib/constants";
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

  return (
    <div
      className={cn(
        "p-4 border-r border-r-black overflow-visible h-[90px] w-[230px] ",
        focusedFilter === "area-size" &&
          "shadow-lg bg-white rounded-t z-10",
        !focusedFilter && "bg-gray-50 "
      )}
      onClick={() => {
        setFocusedFilter("area-size");
      }}
    >
      <div className="">
        <div className="flex flex-col gap-1.5 text-brand-dark-blue">
          <label className="h-5 flex w-full gap-2 items-center">
            {<Tag size={22} />} {"Surface"}
          </label>
          <div className="text-sm h-10 flex items-center">
            {/* both are set */}
            {filters.areaLow && filters.areaHigh && (
              <span className="text-brand-dark-blue">
                {filters.areaLow} - {filters.areaHigh} m²
              </span>
            )}

            {/* only from is set */}
            {filters.areaLow && !filters.areaHigh && (
              <span className="text-brand-dark-blue">
                From {filters.areaLow} m²
              </span>
            )}

            {/* only to is set */}
            {!filters.areaLow && filters.areaHigh && (
              <span className="text-brand-dark-blue">
                Up to {filters.areaHigh} m²
              </span>
            )}
            {/* nothing is set */}
            {!filters.areaLow && !filters.areaHigh && (
              <span className="text-gray-400 tracking-tighter">
                m² From - To
              </span>
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
export default function SurfaceFilter({
  variant,
}: PropertyTypeFilterProps) {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  return (
    <Popover>
      <PopoverTrigger>
        {variant === "homepage" && <BigVariant />}

        {variant === "search" && (
          <Button variant="outline">
            <div className="text-sm h-10 flex items-center">
              {/* both are set */}
              {filters.areaLow && filters.areaHigh && (
                <span className="">
                  {filters.areaLow} - {filters.areaHigh} m²
                </span>
              )}

              {/* only from is set */}
              {filters.areaLow && !filters.areaHigh && (
                <span className="">From {filters.areaLow} m²</span>
              )}

              {/* only to is set */}
              {!filters.areaLow && filters.areaHigh && (
                <span className="">Up to {filters.areaHigh} m²</span>
              )}
              {/* nothing is set */}
              {!filters.areaLow && !filters.areaHigh && (
                <span className=" tracking-tighter">Surface</span>
              )}
            </div>
            <ChevronDown width={20} className="ml-2" />{" "}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent asChild align="start">
        <div
          className={cn(
            " flex p-0 relative rounded shadow-lg  ",
            variant === "homepage" && "w-[418px]",
            variant === "search" && "w-[300px]"
          )}
        >
          <div
            className={cn(
              " rounded-bl  bg-white  py-3",
              variant === "homepage" && "w-[209px] px-5",
              variant === "search" && "w-[150px] px-2"
            )}
          >
            <div className="mb-1.5 focus-within:text-brand-dark-blue">
              <label htmlFor="area-from" className="text-xs ">
                m² From
              </label>
              <input
                className="border border-gray-300 rounded w-full p-1 px-4 text-black "
                name="area-from"
                id="area-from"
                type="text"
                placeholder="10,000"
                value={filters.areaLow}
                onChange={(e) => {
                  updateFilters({
                    areaLow: e.target.value,
                  });
                }}
              />
            </div>
            <ul className="max-h-[175px] overflow-y-auto p-2  relative text-sm bg-white rounded rounded-t-none ">
              {areaFilterOptions.map((area) => (
                <li
                  key={area}
                  className={cn(
                    "px-2 py-1 hover:bg-green-50 cursor-pointer rounded",
                    filters.areaLow === area &&
                      "bg-green-50 text-brand-dark-blue",
                    filters.areaLow === "" &&
                      area === "Any" &&
                      "bg-green-50 text-brand-dark-blue"
                  )}
                  onClick={() => {
                    updateFilters({
                      areaLow: area === "Any" ? "" : area,
                    });
                  }}
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
          <div
            className={cn(
              " rounded-tr rounded-brbg-white  py-3  ",
              variant === "homepage" && "w-[229px] px-5",
              variant === "search" && "w-[150px] px-2"
            )}
          >
            <div className="mb-1.5 focus-within:text-brand-dark-blue">
              <label htmlFor="area-to" className="text-xs ">
                m² Up to
              </label>
              <input
                className="border border-gray-300 rounded w-full p-1 px-4 text-black "
                name="area-to"
                id="area-to"
                type="text"
                placeholder="10,000"
                value={filters.areaHigh}
                onChange={(e) => {
                  updateFilters({
                    areaHigh: e.target.value,
                  });
                }}
              />
            </div>
            <ul className="max-h-[175px] overflow-y-auto p-2  relative text-sm bg-white rounded rounded-t-none ">
              {areaFilterOptions.map((area) => (
                <li
                  key={area}
                  className={cn(
                    "px-2 py-1 hover:bg-green-50 cursor-pointer rounded",
                    filters.areaHigh === area &&
                      "bg-green-50 text-brand-dark-blue",
                    filters.areaHigh === "" &&
                      area === "Any" &&
                      "bg-green-50 text-brand-dark-blue"
                  )}
                  onClick={() => {
                    updateFilters({
                      areaHigh: area === "Any" ? "" : area,
                    });
                  }}
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
