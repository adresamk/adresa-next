"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { House, MapPin, Ruler, Tag } from "lucide-react";
import { useState } from "react";

type SearchFormFilterProps = {
  id: string;
  name: string;
  placeholder: string;
  label: string;
  icon: React.ReactNode;
};
function SearchFormFilter({
  id,
  name,
  placeholder,
  label,
  icon,
}: SearchFormFilterProps) {
  return (
    <div className="border-r border-r-black px-3 py-1">
      <label className="flex w-full gap-2" htmlFor={id}>
        {icon} {label}
      </label>
      <div>
        <input
          id={id}
          name={name}
          type="text"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default function SearchFilter() {
  const [mode, setMode] = useState("sale");

  return (
    <div className="max-w-[900px] flex flex-col gap-2 bg-white/50 backdrop-blur border-white border rounded-lg p-6">
      <div className="flex gap-3">
        <Button
          onClick={() => setMode("sale")}
          size={"sm"}
          className={cn(
            "py-0.5 px-4 h-6 font-semibold bg-white text-blue-500 hover:bg-slate-50",
            mode === "sale" &&
              "bg-blue-400 text-white hover:bg-blue-500"
          )}
        >
          Sale
        </Button>
        <Button
          onClick={() => setMode("rent")}
          size={"sm"}
          className={cn(
            "py-0.5 px-4 h-6 font-semibold bg-white text-blue-500 hover:bg-slate-50",
            mode === "rent" &&
              "bg-blue-400 text-white hover:bg-blue-500"
          )}
        >
          Rent
        </Button>
      </div>
      <div className=" bg-white rounded">
        <form action="">
          <div className="flex flex-wrap p-2 gap-2 ">
            <SearchFormFilter
              icon={<MapPin />}
              label="Location"
              id="location"
              name="location"
              placeholder="Type at least 3 characters"
            />
            <SearchFormFilter
              icon={<House />}
              label="Property Type"
              id="property-type"
              name="property-type"
              placeholder="Home"
            />
            <SearchFormFilter
              icon={<Tag />}
              label="Price"
              id="price"
              name="price"
              placeholder="E From - To"
            />
            <SearchFormFilter
              icon={<Ruler />}
              label="Surface"
              id="surface"
              name="surface"
              placeholder="m2 From - To"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
