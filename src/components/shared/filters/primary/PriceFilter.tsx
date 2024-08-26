"use client";
import { cn } from "@/lib/utils";
import { ChevronDown, Tag } from "lucide-react";
import { priceFilterOptions } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelectedFilter } from "@/hooks/useSelectedFilter";
import { useFilters } from "@/hooks/useFilters";
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
        "p-4 border-r border-r-black overflow-visible h-[90px] w-[230px]",
        focusedFilter === "price" &&
          "shadow-lg bg-white rounded-t z-10",
        !focusedFilter && "bg-gray-50 "
      )}
      onClick={() => {
        setFocusedFilter("price");
      }}
    >
      <div className="">
        <div className="flex flex-col gap-1.5 text-brand-dark-blue">
          <label className="h-5 flex w-full gap-2 items-center">
            {<Tag size={22} />} {"Price"}
          </label>
          <div className="text-sm h-10 flex items-center">
            {/* both are set */}
            {filters.priceLow && filters.priceHigh && (
              <span className="text-brand-dark-blue">
                {filters.priceLow} - {filters.priceHigh} $
              </span>
            )}

            {/* only from is set */}
            {filters.priceLow && !filters.priceHigh && (
              <span className="text-brand-dark-blue">
                From {filters.priceLow} $
              </span>
            )}

            {/* only to is set */}
            {!filters.priceLow && filters.priceHigh && (
              <span className="text-brand-dark-blue">
                Up to {filters.priceHigh} $
              </span>
            )}
            {/* nothing is set */}
            {!filters.priceLow && !filters.priceHigh && (
              <span className="text-gray-400 tracking-tighter">
                $ From - To
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
interface PriceFilterProps {
  variant: "homepage" | "search";
}
export default function PriceFilter({ variant }: PriceFilterProps) {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);

  return (
    <Popover>
      <PopoverTrigger>
        {variant === "homepage" && <BigVariant />}

        {variant === "search" && (
          <Button variant="outline">
            <span className="capitalize">
              {filters.priceLow && filters.priceHigh && (
                <span className="">
                  {filters.priceLow} - {filters.priceHigh} $
                </span>
              )}

              {/* only from is set */}
              {filters.priceLow && !filters.priceHigh && (
                <span className="">From {filters.priceLow} $</span>
              )}

              {/* only to is set */}
              {!filters.priceLow && filters.priceHigh && (
                <span className="">Up to {filters.priceHigh} $</span>
              )}
              {/* nothing is set */}
              {!filters.priceLow && !filters.priceHigh && (
                <span className=" tracking-tighter">Price</span>
              )}
            </span>
            <ChevronDown width={20} className="ml-2" />{" "}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent asChild align="start">
        <div
          className={cn(
            "flex  px-1 relative rounded shadow-lg  ",
            variant === "homepage" && "w-[458px]",
            variant === "search" && "w-[300px]"
          )}
        >
          <div
            className={cn(
              " rounded-bl  bg-white  py-3  ",
              variant === "homepage" && "w-[229px] px-5",
              variant === "search" && "w-[150px] px-2"
            )}
          >
            <div className="mb-1.5 focus-within:text-brand-dark-blue">
              <label htmlFor="price-from" className="text-xs ">
                $ From
              </label>
              <input
                className="border border-gray-300 rounded w-full p-1 px-4 text-black "
                name="price-from"
                id="price-from"
                type="text"
                placeholder="10,000"
                value={filters.priceLow}
                onChange={(e) => {
                  updateFilters({ priceLow: e.target.value });
                }}
              />
            </div>
            <ul className="max-h-[175px] overflow-y-auto  relative text-sm bg-white rounded rounded-t-none ">
              {priceFilterOptions.map((price) => (
                <li
                  key={price}
                  className={cn(
                    "px-2 py-1 hover:bg-green-50 cursor-pointer rounded",
                    filters.priceLow === price &&
                      "bg-green-50 text-brand-dark-blue",
                    filters.priceLow === "" &&
                      price === "Any" &&
                      "bg-green-50 text-brand-dark-blue"
                  )}
                  onClick={() => {
                    updateFilters({
                      priceLow: price === "Any" ? "" : price,
                    });
                  }}
                >
                  {price}
                </li>
              ))}
            </ul>
          </div>
          <div
            className={cn(
              " rounded-bl  bg-white  py-3  ",
              variant === "homepage" && "w-[229px] px-5",
              variant === "search" && "w-[150px] px-2"
            )}
          >
            <div className="mb-1.5 focus-within:text-brand-dark-blue">
              <label htmlFor="price-to" className="text-xs ">
                $ Up to
              </label>
              <input
                className="border border-gray-300 rounded w-full p-1 px-4 text-black "
                name="price-to"
                id="price-to"
                type="text"
                placeholder="10,000"
                value={filters.priceHigh}
                onChange={(e) => {
                  updateFilters({
                    priceHigh: e.target.value,
                  });
                }}
              />
            </div>
            <ul className="max-h-[175px] overflow-y-auto p-2  relative text-sm bg-white rounded rounded-t-none ">
              {priceFilterOptions.map((price) => (
                <li
                  key={price}
                  className={cn(
                    "px-2 py-1 hover:bg-green-50 cursor-pointer rounded",
                    filters.priceHigh === price &&
                      "bg-green-50 text-brand-dark-blue",
                    filters.priceHigh === "" &&
                      price === "Any" &&
                      "bg-green-50 text-brand-dark-blue"
                  )}
                  onClick={() => {
                    updateFilters({
                      priceHigh: price === "Any" ? "" : price,
                    });
                  }}
                >
                  {price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
