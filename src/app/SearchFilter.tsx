"use client";

import { Button } from "@/components/ui/button";
import {
  priceFilterOptions,
  propertyTypes,
  surfaceFilterOptions,
} from "@/global/constants";
import { cn } from "@/lib/utils";
import { cx } from "class-variance-authority";
import { House, MapPin, Ruler, Tag } from "lucide-react";
import { useState } from "react";

type SearchFormFilterProps = {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filters: any;
  setFilters: (filter: any) => void;
};
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
        <div className="flex flex-col gap-3 text-brand-dark-blue">
          <label
            className="flex w-full gap-2 items-center"
            htmlFor={"property-type"}
          >
            {<House size={22} />} {"Property Type"}
          </label>
          <div className="text-sm">
            {filters.propertyType || (
              <span className="text-gray-400">Home</span>
            )}
          </div>
        </div>
        {selectedFilter === "property-type" && (
          <ul className=" w-[184px] p-2 top-[18px] relative text-sm -left-4 bg-white rounded-lg rounded-t-none border-t shadow-lg">
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
        <div className="flex flex-col gap-3 text-brand-dark-blue">
          <label className="flex w-full gap-2 items-center">
            {<Tag size={22} />} {"Price"}
          </label>
          <div className="text-sm">
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
          <div className="flex min-w-[458px] -left-4 relative rounded shadow-lg top-[18px] ">
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
                />
              </div>
              <ul className="max-h-[175px] overflow-y-auto p-2  relative text-sm bg-white rounded-lg rounded-t-none ">
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
                />
              </div>
              <ul className="max-h-[175px] overflow-y-auto p-2  relative text-sm bg-white rounded-lg rounded-t-none ">
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
        <div className="flex flex-col gap-3 text-brand-dark-blue">
          <label className="flex w-full gap-2 items-center">
            {<Tag size={22} />} {"Surface"}
          </label>
          <div className="text-sm">
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
          <div className="flex min-w-[458px] -left-4 relative rounded shadow-lg top-[18px] ">
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
                />
              </div>
              <ul className="max-h-[175px] overflow-y-auto p-2  relative text-sm bg-white rounded-lg rounded-t-none ">
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
                />
              </div>
              <ul className="max-h-[175px] overflow-y-auto p-2  relative text-sm bg-white rounded-lg rounded-t-none ">
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
  const [selectedFilter, setSelectedFilter] =
    useState<string>("surface");
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
    <div className="max-w-[900px] flex flex-col gap-2 bg-white/50 backdrop-blur border-white border rounded-lg p-6">
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
            <div className="border-r border-r-black px-3 py-1">
              <label
                className="flex w-full gap-2"
                htmlFor={"location"}
              >
                {<MapPin />} {"Location"}
              </label>
              <div>
                <input
                  id={"location"}
                  name={"location"}
                  type="text"
                  placeholder={"Type at least 3 characters"}
                />
              </div>
            </div>

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
          </div>
        </form>
      </div>
    </div>
  );
}
