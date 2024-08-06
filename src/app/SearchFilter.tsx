"use client";

import { Button } from "@/components/ui/button";
import {
  locationDropdownOptions,
  priceFilterOptions,
  propertyTypes,
  surfaceFilterOptions,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { cx } from "class-variance-authority";
import {
  House,
  Map,
  MapPin,
  Pin,
  Ruler,
  Search,
  Tag,
} from "lucide-react";
import { useState } from "react";

type SearchFormFilterProps = {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filters: any;
  setFilters: (filter: any) => void;
};
function LocationFilter({
  selectedFilter,
  setSelectedFilter,
  filters,
  setFilters,
}: SearchFormFilterProps) {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  return (
    <div
      className={cx(
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
        {selectedFilter === "location" && suggestionsOpen && (
          <ul className=" w-full flex flex-col p-2 top-[5px] max-h-[280px] overflow-y-auto relative text-sm -left-4 bg-white rounded rounded-t-none  shadow-lg">
            {locationDropdownOptions.map((location) => (
              <li
                key={location}
                className={cx(
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
      </div>
    </div>
  );
}
function PropertyTypeFilter({
  selectedFilter,
  setSelectedFilter,
  filters,
  setFilters,
}: SearchFormFilterProps) {
  return (
    <div
      className={cx(
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
        {selectedFilter === "property-type" && (
          <ul className=" w-[184px] p-2 top-[4px] relative text-sm -left-4 bg-white rounded rounded-t-none  shadow-lg">
            {propertyTypes.map((type) => (
              <li
                key={type}
                className={cx(
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
        )}
      </div>
    </div>
  );
}

function PriceFilter({
  selectedFilter,
  setSelectedFilter,
  filters,
  setFilters,
}: SearchFormFilterProps) {
  return (
    <div
      className={cx(
        "p-4 border-r border-r-black overflow-visible h-[90px] w-[230px] ",
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
        {selectedFilter === "price" && (
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
                    className={cx(
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
                    className={cx(
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
        )}
      </div>
    </div>
  );
}

function SurfaceFilter({
  selectedFilter,
  setSelectedFilter,
  filters,
  setFilters,
}: SearchFormFilterProps) {
  return (
    <div
      className={cx(
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
        {selectedFilter === "surface" && (
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
                    className={cx(
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
                    className={cx(
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
        )}
      </div>
    </div>
  );
}

export default function SearchFilter() {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [filters, setFilters] = useState({
    mode: "sale",
    location: "",
    propertyType: "Home",
    price: {
      from: "",
      to: "",
    },
    surface: {
      from: "",
      to: "",
    },
  });

  return (
    <div className="max-w-[900px] flex flex-col gap-2 bg-white/50 backdrop-blur border-white border rounded p-6">
      <div className="flex gap-3">
        <Button
          onClick={() =>
            setFilters((prev) => ({ ...prev, mode: "sale" }))
          }
          size={"sm"}
          className={cn(
            "py-0.5 px-4 h-6 font-semibold bg-white text-brand-light-blue hover:bg-slate-50 ",
            filters.mode === "sale" &&
              "bg-blue-400 text-white hover:bg-blue-500",
            filters.mode !== "sale" &&
              "border-brand-light-blue border"
          )}
        >
          Sale
        </Button>
        <Button
          onClick={() =>
            setFilters((prev) => ({ ...prev, mode: "rent" }))
          }
          size={"sm"}
          className={cn(
            "py-0.5 px-4 h-6 font-semibold bg-white text-brand-light-blue hover:bg-slate-50",
            filters.mode === "rent" &&
              "bg-blue-400 text-white hover:bg-blue-500",
            filters.mode !== "rent" &&
              "border-brand-light-blue border"
          )}
        >
          Rent
        </Button>
      </div>
      <div className="bg-gray-50 rounded">
        <form action="">
          <div className="flex flex-wrap p-2 gap-2 ">
            <LocationFilter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              filters={filters}
              setFilters={setFilters}
            />

            <PropertyTypeFilter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              filters={filters}
              setFilters={setFilters}
            />

            <PriceFilter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              filters={filters}
              setFilters={setFilters}
            />

            <SurfaceFilter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              filters={filters}
              setFilters={setFilters}
            />

            <div className="w-full max-w-[205px] flex items-center justify-center">
              <Button
                size={"lg"}
                className="py-0.5 px-4 h-12 w-full font-semibold text-lg uppercase   "
              >
                Search <Search className="ml-3" size={18} />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
