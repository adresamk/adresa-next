"use client";
import { Button } from "@/components/ui/button";
import ModeFilter from "./primary/ModeFilter";
import PriceFilter from "./primary/PriceFilter";
import PropertyTypeFilter from "./primary/PropertyTypeFilter";
import SubTypeFilter from "./primary/SubtypeFilter";
import SurfaceFilter from "./primary/SurfaceFilter";
import {
  Bed,
  ChevronDown,
  Search,
  SlidersVertical,
} from "lucide-react";
import SmartOverlay from "../SmartOverlay";
import { useContext, useState } from "react";
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
import { useRouter, NextRouter } from "next/router";

function Footer() {
  const router: NextRouter = useRouter();
  const filters = useFilters((store) => store.filters);
  // const updateFilters = useFilters((store) => store.updateFilters);
  const clearSecondaryFilters = useFilters(
    (store) => store.clearSecondaryFilters
  );
  const updateSecondarySearchParams = () => {
    const secondaryFilters = {
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
    };
    const currentSearchParams = new URLSearchParams(router.asPath);
    Object.entries(secondaryFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        currentSearchParams.set(key, String(value));
      } else {
        currentSearchParams.delete(key);
      }
    });
    router.push(
      `${router.pathname}?${currentSearchParams.toString()}`
    );
    const results = {
      length: Math.floor(Math.random() * 100),
    };
    return (
      <div className="flex justify-between items-end w-full">
        <Button
          variant="ghost"
          className="text-gray-500"
          onClick={() => {
            clearSecondaryFilters();
          }}
        >
          Clear all
        </Button>
        <Button
          onClick={() => {
            updateSecondarySearchParams();
          }}
          className="bg-brand-light-blue"
        >
          <Search width={20} className="mr-2" />
          View {results.length} Results
        </Button>
      </div>
    );
  };
  const results = {
    length: Math.floor(Math.random() * 100),
  };
  return (
    <div className="flex justify-between items-end w-full">
      <Button
        variant="ghost"
        className="text-gray-500"
        onClick={() => {
          clearSecondaryFilters();
        }}
      >
        Clear all
      </Button>
      <Button
        onClick={() => {
          updateSecondarySearchParams();
        }}
        className="bg-brand-light-blue"
      >
        <Search width={20} className="mr-2" />
        View {results.length} Results
      </Button>
    </div>
  );
}
export default function Filters() {
  const [areMoreFiltersOpen, setAreMoreFiltersOpen] = useState(true);
  return (
    <aside className="flex gap-3 items-center px-6 min-h-[70px] top-[80px] sticky z-10 shadow-md bg-white">
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
        <SlidersVertical
          width={20}
          className="mr-2 text-brand-light-blue"
        />
        <span className="capitalize">Filters</span>
        <ChevronDown width={20} className="ml-2" />{" "}
      </Button>
      <SmartOverlay
        isOpen={areMoreFiltersOpen}
        onClose={() => setAreMoreFiltersOpen(false)}
        title="More Filters"
        description="Select more filters to refine your search"
        innerScroll
        footerJSX={<Footer />}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap border-b-2 py-2.5 px-1.5">
            <FloorsFilter />
          </div>
          <div className="flex flex-wrap border-b-2 py-2.5 px-1.5">
            <BedroomsFilter />
          </div>
          <div className="flex flex-wrap border-b-2 py-2.5 px-1.5">
            <ConstructionYearFilter />
          </div>
          <div className="flex flex-wrap border-b-2 py-2.5 px-1.5 items-end gap-3">
            <HeatingTypeFilter />
            <FurnitureFilter />
          </div>

          <div className="flex flex-wrap border-b-2 py-2.5 px-1.5 items-end gap-3">
            <InternalFeaturesFilter />
          </div>
          <div className="flex flex-wrap border-b-2 py-2.5 px-1.5 items-end gap-3">
            <ExternalFeaturesFilter />
          </div>
          <div className="flex flex-wrap border-b-2 py-2.5 px-1.5 items-end gap-3">
            <LastUpdatedFilter />
          </div>
          <div className="flex flex-wrap border-b-2 py-2.5 px-1.5 items-end gap-3">
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
