"use client";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LocationFilter from "./LocationFilter";
import PropertyTypeFilter from "./PropertyTypeFilter";
import PriceFilter from "./PriceFilter";
import SurfaceFilter from "./SurfaceFilter";

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
              <Link href={"/search"}>
                <Button
                  size={"lg"}
                  className="py-0.5 px-4 h-12 w-full font-semibold text-lg uppercase   "
                >
                  Search <Search className="ml-3" size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
