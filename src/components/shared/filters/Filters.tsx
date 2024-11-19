"use client";

import { Button } from "@/components/ui/button";
import ModeFilter from "./primary/ModeFilter";
import PriceFilter from "./primary/PriceFilter";
import PropertyTypeFilter from "./primary/PropertyTypeFilter";
import SurfaceFilter from "./primary/SurfaceFilter";
import SubTypeFilter from "./primary/SubTypeFilter";

import { ChevronDown, Search, SlidersVertical } from "lucide-react";
import SmartOverlay from "../SmartOverlay";
import { useEffect, useState } from "react";
import FloorsFilter from "./secondary/FloorsFilter";
import BedroomsFilter from "./secondary/BedroomsFilter";
import ConstructionYearFilter from "./secondary/ConstructionYearFilter";
import HeatingTypeFilter from "./secondary/HeatingTypeFilter";
import FurnitureFilter from "./secondary/FurnitureFilter";
import ExternalFeaturesFilter from "./secondary/ExternalFeaturesFilter";
import InternalFeaturesFilter from "./secondary/InternalFeaturesFilter";
import LastUpdatedFilter from "./secondary/LastUpdatedFilter";
import CreationDateFilter from "./secondary/CreationDateFilter";

import { useFilters } from "@/hooks/useFilters";
import { usePathname, useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { secondaryFiltersParsers } from "@/app/[locale]/searchParams";
import CreateSavedSearch from "./CreateSavedSearch";

export const dynamic = "force-dynamic";

export default function Filters() {
  // not sure why we need this
  const router = useRouter();
  const pathname = usePathname();
  const shouldUpdate = useFilters((store) => store.shouldUpdate);

  const [areMoreFiltersOpen, setAreMoreFiltersOpen] = useState(false);

  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  const clearSecondaryFilters = useFilters(
    (store) => store.clearSecondaryFilters,
  );

  let [secondarySearchParams, setSecondarySearchParams] = useQueryStates(
    secondaryFiltersParsers,
    {
      history: "push",
    },
  );
  let {
    floorNumberLow,
    floorNumberHigh,
    bedroomsNumberLow,
    bedroomsNumberHigh,
    constructionYearLow,
    constructionYearHigh,
    isNewDevelopment,
    heatingType,
    isFurnitureIncluded,
    externalFeatures,
    internalFeatures,
    lastUpdated,
    creationDate,
  } = secondarySearchParams;

  // update the filters state based on search params on mount
  useEffect(() => {
    updateFilters({
      floorNumberLow,
      floorNumberHigh,
      bedroomsNumberLow,
      bedroomsNumberHigh,
      constructionYearLow,
      constructionYearHigh,
      isNewDevelopment,
      heatingType,
      isFurnitureIncluded,
      externalFeatures,
      internalFeatures,
      lastUpdated,
      creationDate,
    });
  }, [
    bedroomsNumberHigh,
    bedroomsNumberLow,
    constructionYearHigh,
    constructionYearLow,
    creationDate,
    externalFeatures,
    floorNumberHigh,
    floorNumberLow,
    heatingType,
    internalFeatures,
    isFurnitureIncluded,
    isNewDevelopment,
    lastUpdated,
    secondarySearchParams,
    updateFilters,
  ]);

  const results = {
    length: Math.floor(Math.random() * 100),
  };
  const moreFiltersFooter = (
    <div className="flex w-full items-end justify-between">
      <Button
        variant="ghost"
        className="text-gray-500"
        onClick={() => {
          router.replace(pathname);
          setAreMoreFiltersOpen(false);

          // no need for this it takes care by itself (hopefully) but question is do we want to reset
          // the primary filters as well?
          // clearSecondaryFilters();
        }}
      >
        Clear all
      </Button>
      <Button
        onClick={() => {
          setSecondarySearchParams({
            floorNumberLow: filters.floorNumberLow,
            floorNumberHigh: filters.floorNumberHigh,
            bedroomsNumberLow: filters.bedroomsNumberLow,
            bedroomsNumberHigh: filters.bedroomsNumberHigh,
            constructionYearLow: filters.constructionYearLow,
            constructionYearHigh: filters.constructionYearHigh,
            isNewDevelopment: filters.isNewDevelopment,
            heatingType: filters.heatingType,
            isFurnitureIncluded: filters.isFurnitureIncluded,
            externalFeatures: filters.externalFeatures,
            internalFeatures: filters.internalFeatures,
            lastUpdated: filters.lastUpdated,
            creationDate: filters.creationDate,
          });
          setTimeout(() => {
            // to force the new queries on the server, without setTimeout its late one click
            router.refresh();
            setAreMoreFiltersOpen(false);
          }, 0);
        }}
        className="bg-brand-light-blue"
      >
        <Search width={20} className="mr-2" />
        View {results.length} Results
      </Button>
    </div>
  );

  return (
    <aside className="sticky top-[80px] z-10 flex min-h-[70px] items-center gap-3 bg-white px-6 shadow-md">
      <ModeFilter variant="search" />
      <PropertyTypeFilter variant="search" />
      <SubTypeFilter variant="search" />
      <PriceFilter variant="search" />
      <SurfaceFilter variant="search" />
      <Button
        variant="outline"
        className="px-2"
        onClick={() => {
          setAreMoreFiltersOpen(true);
        }}
      >
        <SlidersVertical width={20} className="mr-2 text-brand-light-blue" />
        <span className="capitalize">Filters</span>
        <ChevronDown width={20} className="ml-2" />{" "}
      </Button>
      <CreateSavedSearch />
      <SmartOverlay
        isOpen={areMoreFiltersOpen}
        onClose={() => setAreMoreFiltersOpen(false)}
        title="More Filters"
        description="Select more filters to refine your search"
        innerScroll
        footerJSX={moreFiltersFooter}
      >
        <div className="flex flex-col gap-3">
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
          </div>
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
