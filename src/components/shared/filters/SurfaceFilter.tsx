import { cn } from "@/lib/utils";
import { SearchFormFilterProps } from "./filter-types";
import { Tag } from "lucide-react";
import { surfaceFilterOptions } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
export default function SurfaceFilter({
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
            "p-4 border-r border-r-black overflow-visible h-[90px] w-[230px] ",
            selectedFilter === "surface" &&
              "shadow-lg bg-white rounded-t z-10",
            !selectedFilter && "bg-gray-50 "
          )}
          onClick={() => {
            setSelectedFilter("surface");
          }}
        >
          <div className="">
            <div className="flex flex-col gap-1.5 text-brand-dark-blue">
              <label className="h-5 flex w-full gap-2 items-center">
                {<Tag size={22} />} {"Surface"}
              </label>
              <div className="text-sm h-10 flex items-center">
                {/* both are set */}
                {filters.surface.from && filters.surface.to && (
                  <span className="text-brand-dark-blue">
                    {filters.surface.from} - {filters.surface.to} m²
                  </span>
                )}

                {/* only from is set */}
                {filters.surface.from && !filters.surface.to && (
                  <span className="text-brand-dark-blue">
                    From {filters.surface.from} m²
                  </span>
                )}

                {/* only to is set */}
                {!filters.surface.from && filters.surface.to && (
                  <span className="text-brand-dark-blue">
                    Up to {filters.surface.to} m²
                  </span>
                )}
                {/* nothing is set */}
                {!filters.surface.from && !filters.surface.to && (
                  <span className="text-gray-400 tracking-tighter">
                    m² From - To
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex min-w-[458px] -left-4 relative rounded shadow-lg top-[4px] ">
          <div className="min-w-[229px] rounded-bl  bg-white px-5 py-3  ">
            <div className="mb-1.5 focus-within:text-brand-dark-blue">
              <label htmlFor="surface-from" className="text-xs ">
                m² From
              </label>
              <input
                className="border border-gray-300 rounded w-full p-1 px-4 text-black "
                name="surface-from"
                id="surface-from"
                type="text"
                placeholder="10,000"
                value={filters.surface.from}
                onChange={(e) => {
                  setFilters((prev: any) => ({
                    ...prev,
                    surface: {
                      ...prev.surface,
                      from: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <ul className="max-h-[175px] overflow-y-auto p-2  relative text-sm bg-white rounded rounded-t-none ">
              {surfaceFilterOptions.map((surface) => (
                <li
                  key={surface}
                  className={cn(
                    "px-2 py-1 hover:bg-green-50 cursor-pointer rounded",
                    filters.surface.from === surface &&
                      "bg-green-50 text-brand-dark-blue",
                    filters.surface.from === "" &&
                      surface === "Any" &&
                      "bg-green-50 text-brand-dark-blue"
                  )}
                  onClick={() => {
                    setFilters((prev: any) => ({
                      ...prev,
                      surface: {
                        ...prev.surface,
                        from: surface === "Any" ? "" : surface,
                      },
                    }));
                  }}
                >
                  {surface}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-[229px] rounded-tr rounded-br  bg-white px-5 py-3  ">
            <div className="mb-1.5 focus-within:text-brand-dark-blue">
              <label htmlFor="surface-to" className="text-xs ">
                m² Up to
              </label>
              <input
                className="border border-gray-300 rounded w-full p-1 px-4 text-black "
                name="surface-to"
                id="surface-to"
                type="text"
                placeholder="10,000"
                value={filters.surface.to}
                onChange={(e) => {
                  setFilters((prev: any) => ({
                    ...prev,
                    surface: {
                      ...prev.surface,
                      to: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <ul className="max-h-[175px] overflow-y-auto p-2  relative text-sm bg-white rounded rounded-t-none ">
              {surfaceFilterOptions.map((surface) => (
                <li
                  key={surface}
                  className={cn(
                    "px-2 py-1 hover:bg-green-50 cursor-pointer rounded",
                    filters.surface.to === surface &&
                      "bg-green-50 text-brand-dark-blue",
                    filters.surface.to === "" &&
                      surface === "Any" &&
                      "bg-green-50 text-brand-dark-blue"
                  )}
                  onClick={() => {
                    setFilters((prev: any) => ({
                      ...prev,
                      surface: {
                        ...prev.surface,
                        to: surface === "Any" ? "" : surface,
                      },
                    }));
                  }}
                >
                  {surface}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
