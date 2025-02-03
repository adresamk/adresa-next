"use client";

import { Button } from "@/components/ui/button";
import ModeFilter from "./primary/TransactionTypeFilter";
import PriceFilter from "./primary/PriceFilter";
import CategoryFilter from "./primary/CategoryFilter";
import AreaFilter from "./primary/AreaFilter";
import Type from "./primary/TypeFilter";

import { ChevronDown, Search, SlidersVertical } from "lucide-react";
import SmartOverlay from "../SmartOverlay";
import { useEffect, useState } from "react";

import { useFilters } from "@/hooks/useFilters";
import { usePathname, useRouter } from "next/navigation";
import CreateSavedSearch from "./CreateSavedSearch";
import { useTranslations } from "next-intl";
import AdditionalFeaturesFilters from "./AdditionalFeaturesFilters";

export default function Filters() {
  // not sure why we need this
  const router = useRouter();
  const pathname = usePathname();
  const shouldUpdate = useFilters((store) => store.shouldUpdate);
  const t = useTranslations("");
  const [areMoreFiltersOpen, setAreMoreFiltersOpen] = useState(false);
  const [selectedFeaturesKeys, setSelectedFeaturesKeys] = useState<string[]>(
    [],
  );
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  const clearSecondaryFilters = useFilters(
    (store) => store.clearSecondaryFilters,
  );

  const results = {
    length: Math.floor(Math.random() * 100),
  };
  const moreFiltersFooter = (
    <div className="flex w-full items-end justify-between">
      <Button
        variant="ghost"
        className="text-gray-500"
        onClick={() => {
          if (pathname) {
            router.replace(pathname);
            setAreMoreFiltersOpen(false);
          }

          // no need for this it takes care by itself (hopefully) but question is do we want to reset
          // the primary filters as well?
          // clearSecondaryFilters();
        }}
      >
        {t("search.filters.clearAll")}
      </Button>
      <Button
        onClick={() => {
          // setSecondarySearchParams({
          //   floorNumberLow: filters.floorNumberLow,
          //   floorNumberHigh: filters.floorNumberHigh,
          //   bedroomsNumberLow: filters.bedroomsNumberLow,
          //   bedroomsNumberHigh: filters.bedroomsNumberHigh,
          //   constructionYearLow: filters.constructionYearLow,
          //   constructionYearHigh: filters.constructionYearHigh,
          //   isNewDevelopment: filters.isNewDevelopment,
          //   heatingType: filters.heatingType,
          //   isFurnitureIncluded: filters.isFurnitureIncluded,
          //   externalFeatures: filters.externalFeatures,
          //   internalFeatures: filters.internalFeatures,
          //   lastUpdated: filters.lastUpdated,
          //   creationDate: filters.creationDate,
          // });
          setTimeout(() => {
            // to force the new queries on the server, without setTimeout its late one click
            router.refresh();
            setAreMoreFiltersOpen(false);
          }, 0);
        }}
        className="bg-brand-light-blue"
      >
        <Search width={20} className="mr-2" />
        {t("search.filters.viewResults", { count: results.length })}
      </Button>
    </div>
  );

  return (
    <aside className="sticky top-[60px] z-10 flex w-full items-center gap-3 overflow-x-auto bg-white px-6 py-2 shadow-md md:top-[80px]">
      <ModeFilter variant="search" />
      <CategoryFilter variant="search" />
      <Type variant="search" />
      <PriceFilter variant="search" />
      <AreaFilter variant="search" />
      <Button
        variant="outline"
        className="h-8 px-1 py-0.5 md:h-10 md:px-2 md:py-1"
        onClick={() => {
          setAreMoreFiltersOpen(true);
        }}
      >
        <SlidersVertical
          width={20}
          className="mr-2 h-4 w-4 text-brand-light-blue md:h-5 md:w-5"
        />
        <span className="capitalize">{t("search.filters.title")}</span>
        <ChevronDown width={20} className="ml-2 h-4 w-4 md:h-5 md:w-5" />{" "}
      </Button>
      <CreateSavedSearch />
      <SmartOverlay
        isOpen={areMoreFiltersOpen}
        onClose={() => setAreMoreFiltersOpen(false)}
        title={t("search.filters.title")}
        description={t("search.filters.description")}
        innerScroll
        footerJSX={moreFiltersFooter}
      >
        <div>
          <AdditionalFeaturesFilters
            selectedFeaturesKeys={selectedFeaturesKeys}
            setSelectedFeaturesKeys={setSelectedFeaturesKeys}
          />
          {/* <div className="flex flex-col gap-3">
          <div className="flex flex-wrap border-b-2 px-1.5 py-2.5">
            <FloorsFilter />
          </div>
          <div className="flex flex-wrap border-b-2 px-1.5 py-2.5">
            <BedroomsFilter />
          </div>
          <div className="flex flex-wrap border-b-2 px-1.5 py-2.5">
            <ConstructionYearFilter />
          </div>
          <div className="flex flex-wrap items-end gap-3 border-b-2 px-1.5 py-2.5">
            <HeatingTypeFilter />
            <FurnitureFilter />
          </div>

          <div className="flex flex-wrap items-end gap-3 border-b-2 px-1.5 py-2.5">
            <InternalFeaturesFilter />
          </div>
          <div className="flex flex-wrap items-end gap-3 border-b-2 px-1.5 py-2.5">
            <ExternalFeaturesFilter />
          </div>
          <div className="flex flex-wrap items-end gap-3 border-b-2 px-1.5 py-2.5">
            <LastUpdatedFilter />
          </div>
          <div className="flex flex-wrap items-end gap-3 border-b-2 px-1.5 py-2.5">
            <CreationDateFilter />
          </div> */}
          {/* 
          <HeatingFuelFilter />
          <SuitableForFilter />
          <IsAtAuctionFilter />
          <IsFurnishedFilter />
          <ReductionsIncludedFilter />
          <ImagesIncludedFilter />
          <LastUpdatedFilter />
          <CreationDateFilter /> 
          */}
        </div>
      </SmartOverlay>
    </aside>
  );
}
