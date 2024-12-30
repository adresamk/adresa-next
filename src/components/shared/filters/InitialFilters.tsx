"use client";
import { cn } from "@/lib/utils";
import LocationFilter from "./primary/LocationFilter";
import CategoryFilter from "./primary/CategoryFilter";
import PriceFilter from "./primary/PriceFilter";
import AreaFilter from "./primary/AreaFilter";
import TransactionTypeFilter from "./primary/TransactionTypeFilter";
import { useSelectedFilter } from "@/hooks/useSelectedFilter";

import SearchButton from "./SearchButton";

export default function SearchFilter() {
  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);

  return (
    <section className="mx-5 flex w-full max-w-7xl flex-col gap-1 rounded-3xl border border-slate-300 bg-white/30 p-6 px-5 backdrop-blur">
      <TransactionTypeFilter variant="homepage" />
      <div
        className={cn(
          "relative mt-1.5 flex w-full flex-wrap rounded-xl bg-slate-50 xl:min-h-[90px]",
          focusedFilter === "location" && "rounded-bl-none",
        )}
      >
        <LocationFilter variant="homepage" />
        <CategoryFilter variant="homepage" />
        <PriceFilter variant="homepage" />
        <AreaFilter variant="homepage" />

        <div className="xl:right flex w-full items-center justify-center p-5 pl-1.5 sm:absolute sm:right-0 sm:top-0 sm:max-w-[205px] xl:static xl:top-0">
          <SearchButton variant="homepage" />
        </div>
      </div>
    </section>
  );
}
