"use client";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import LocationFilter from "./primary/LocationFilter";
import PropertyTypeFilter from "./primary/PropertyTypeFilter";
import PriceFilter from "./primary/PriceFilter";
import SurfaceFilter from "./primary/SurfaceFilter";
import ModeFilter from "./primary/ModeFilter";
import { useSelectedFilter } from "@/hooks/useSelectedFilter";

export default function SearchFilter() {
  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 rounded-3xl border border-slate-100 bg-white/50 p-6 px-5 backdrop-blur">
      <ModeFilter variant="homepage" />
      <div
        className={cn(
          "relative mt-2.5 flex w-full flex-wrap rounded-xl bg-slate-50 xl:h-[90px]",
          focusedFilter === "location" && "rounded-bl-none",
        )}
      >
        <LocationFilter variant="homepage" />
        <PropertyTypeFilter variant="homepage" />
        <PriceFilter variant="homepage" />
        <SurfaceFilter variant="homepage" />

        <div className="flex w-full max-w-[205px] items-center justify-center">
          <Link href={"/search"}>
            <Button
              size={"lg"}
              className="h-12 w-full px-4 py-0.5 text-lg font-semibold uppercase"
            >
              Search <Search className="ml-3" size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
