import { cn } from "@/lib/utils";
import { SearchFormFilterProps } from "./filter-types";
import { Tag } from "lucide-react";
import { priceFilterOptions } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function PriceFilter({
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
            "p-4 border-r border-r-black overflow-visible h-[90px] w-[230px]",
            selectedFilter === "price" &&
              "shadow-lg bg-white rounded-t z-10",
            !selectedFilter && "bg-gray-50 "
          )}
          onClick={() => {
            setSelectedFilter("price");
          }}
        >
          <div className="">
            <div className="flex flex-col gap-1.5 text-brand-dark-blue">
              <label className="h-5 flex w-full gap-2 items-center">
                {<Tag size={22} />} {"Price"}
              </label>
              <div className="text-sm h-10 flex items-center">
                {/* both are set */}
                {filters.price.from && filters.price.to && (
                  <span className="text-brand-dark-blue">
                    {filters.price.from} - {filters.price.to} $
                  </span>
                )}

                {/* only from is set */}
                {filters.price.from && !filters.price.to && (
                  <span className="text-brand-dark-blue">
                    From {filters.price.from} $
                  </span>
                )}

                {/* only to is set */}
                {!filters.price.from && filters.price.to && (
                  <span className="text-brand-dark-blue">
                    Up to {filters.price.to} $
                  </span>
                )}
                {/* nothing is set */}
                {!filters.price.from && !filters.price.to && (
                  <span className="text-gray-400 tracking-tighter">
                    $ From - To
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
              <label htmlFor="price-from" className="text-xs ">
                $ From
              </label>
              <input
                className="border border-gray-300 rounded w-full p-1 px-4 text-black "
                name="price-from"
                id="price-from"
                type="text"
                placeholder="10,000"
                value={filters.price.from}
                onChange={(e) => {
                  setFilters((prev: any) => ({
                    ...prev,
                    price: {
                      ...prev.price,
                      from: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <ul className="max-h-[175px] overflow-y-auto p-2  relative text-sm bg-white rounded rounded-t-none ">
              {priceFilterOptions.map((price) => (
                <li
                  key={price}
                  className={cn(
                    "px-2 py-1 hover:bg-green-50 cursor-pointer rounded",
                    filters.price.from === price &&
                      "bg-green-50 text-brand-dark-blue",
                    filters.price.from === "" &&
                      price === "Any" &&
                      "bg-green-50 text-brand-dark-blue"
                  )}
                  onClick={() => {
                    setFilters((prev: any) => ({
                      ...prev,
                      price: {
                        ...prev.price,
                        from: price === "Any" ? "" : price,
                      },
                    }));
                  }}
                >
                  {price}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-[229px] rounded-tr rounded-br  bg-white px-5 py-3  ">
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
                value={filters.price.to}
                onChange={(e) => {
                  setFilters((prev: any) => ({
                    ...prev,
                    price: {
                      ...prev.price,
                      to: e.target.value,
                    },
                  }));
                }}
              />
            </div>
            <ul className="max-h-[175px] overflow-y-auto p-2  relative text-sm bg-white rounded rounded-t-none ">
              {priceFilterOptions.map((price) => (
                <li
                  key={price}
                  className={cn(
                    "px-2 py-1 hover:bg-green-50 cursor-pointer rounded",
                    filters.price.to === price &&
                      "bg-green-50 text-brand-dark-blue",
                    filters.price.to === "" &&
                      price === "Any" &&
                      "bg-green-50 text-brand-dark-blue"
                  )}
                  onClick={() => {
                    setFilters((prev: any) => ({
                      ...prev,
                      price: {
                        ...prev.price,
                        to: price === "Any" ? "" : price,
                      },
                    }));
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
