"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Link } from "@/i18n/routing";
import LocationFilter from "./primary/LocationFilter";
import CategoryFilter from "./primary/CategoryFilter";
import PriceFilter from "./primary/PriceFilter";
import AreaFilter from "./primary/AreaFilter";
import TransactionTypeFilter from "./primary/TransactionTypeFilter";
import { useSelectedFilter } from "@/hooks/useSelectedFilter";
import { useTranslations } from "next-intl";
import { useFilters } from "@/hooks/useFilters";
import { generateSearchUrl } from "@/lib/filters";
import { useEffect } from "react";

export default function SearchFilter() {
  const t = useTranslations();
  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);
  const filters = useFilters((store) => store.filters);

  const newDestination =
    filters.location === "" ? "#" : generateSearchUrl(filters);
  //effect description

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

        <div className="xl:right absolute right-0 top-0 flex w-full max-w-[205px] items-center justify-center p-5 pl-1.5 xl:static xl:top-0">
          <Link href={newDestination}>
            <Button
              size={"lg"}
              className="h-12 w-full min-w-[180px] px-2.5 py-0.5 text-sm font-bold uppercase tracking-tight"
            >
              {t("common.buttons.search")}
              <Search className="ml-3" size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
