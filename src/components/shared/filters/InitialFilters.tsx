"use client";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import LocationFilter from "./LocationFilter";
import PropertyTypeFilter from "./PropertyTypeFilter";
import PriceFilter from "./PriceFilter";
import SurfaceFilter from "./SurfaceFilter";
import ModeFilter from "./ModeFilter";

export default function SearchFilter() {
  return (
    <div className="max-w-[900px] flex flex-col gap-2 bg-white/50 backdrop-blur border-white border rounded p-6">
      <ModeFilter variant="homepage" />
      <div className="bg-gray-50 rounded">
        <form action="">
          <div className="flex flex-wrap p-2 gap-2 ">
            <LocationFilter variant="homepage" />
            <PropertyTypeFilter variant="homepage" />
            <PriceFilter variant="homepage" />
            <SurfaceFilter variant="homepage" />

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
