"use client";

import { Button } from "@/components/ui/button";
import ModeFilter from "./primary/TransactionTypeFilter";
import PriceFilter from "./primary/PriceFilter";
import CategoryFilter from "./primary/CategoryFilter";
import AreaFilter from "./primary/AreaFilter";
import Type from "./primary/TypeFilter";

import { ChevronDown, Loader2, Search, SlidersVertical } from "lucide-react";
import SmartOverlay from "../SmartOverlay";
import { useEffect, useRef, useState } from "react";

import { useFilters } from "@/hooks/useFilters";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CreateSavedSearch from "./CreateSavedSearch";
import { useTranslations } from "next-intl";
import AdditionalFeaturesFilters from "./AdditionalFeaturesFilters";
import { Feature, Listing } from "@prisma/client";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

export default function Filters({ listings }: { listings: Listing[] }) {
  // not sure why we need this
  const router = useRouter();
  const pathname = usePathname();
  const shouldUpdate = useFilters((store) => store.shouldUpdate);
  const t = useTranslations("");

  const [appliedFeatures, setAppliedFeatures] = useQueryState(
    "f",
    parseAsArrayOf(parseAsString).withOptions({
      shallow: false,
      history: "push",
    }),
  );

  const [areMoreFiltersOpen, setAreMoreFiltersOpen] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrievingSearchHits, setIsRetrievingSearchHits] = useState(false);
  const [selectedFeaturesKeys, setSelectedFeaturesKeys] = useState<string[]>(
    () => appliedFeatures || [],
  );
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);

  const clearSecondaryFilters = useFilters(
    (store) => store.clearSecondaryFilters,
  );
  const isFirstRender = useRef(true);
  const [searchHits, setSearchHits] = useState(listings.length);
  useEffect(() => {
    const fetchFeatures = async () => {
      setIsLoading(true);
      const response = await fetch("/api/listing/features");
      const data = await response.json();
      // console.log(data);
      setFeatures(data.features);
      setIsLoading(false);
    };
    fetchFeatures();
  }, []);

  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // console.log("pathname", pathname);
    // console.log("isFirstRender", isFirstRender.current);
    // this will execute on every render except the first one

    const fetchListingCount = async () => {
      setIsRetrievingSearchHits(true);
      // const newDestination = pathname;
      // console.log("newDestination", newDestination);
      const response = await fetch(
        `/api/listing/count?path=${pathname}&${
          selectedFeaturesKeys ? `f=${selectedFeaturesKeys.toString()}` : ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      console.log(data);
      setSearchHits(data.count);
      setIsRetrievingSearchHits(false);
    };
    fetchListingCount();

    // setSearchHits(listings.length);
  }, [listings, selectedFeaturesKeys, pathname]);
  const moreFiltersFooter = (
    <div className="flex w-full items-end justify-between">
      <Button
        variant="ghost"
        className="text-gray-500"
        onClick={() => {
          if (pathname) {
            setSelectedFeaturesKeys([]);
            setAppliedFeatures([]);
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
          // console.log("pathname", pathname);
          // console.log("selectedFeaturesKeys", selectedFeaturesKeys);
          setAppliedFeatures(selectedFeaturesKeys);
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
            // router.refresh();
            setAreMoreFiltersOpen(false);
          }, 0);
        }}
        className={"bg-brand-light-blue"}
      >
        {isRetrievingSearchHits ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>
            <Search width={20} className="mr-2" />
            {t("search.filters.viewResults", { count: searchHits })}
          </>
        )}
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
        // onConfirm={() => {
        //   // setAreMoreFiltersOpen(false);
        //   // updateURL / make request
        //   console.log("selectedFeaturesKeys", selectedFeaturesKeys);
        //   setAppliedFeatures(selectedFeaturesKeys);
        // }}
        description={t("search.filters.description")}
        innerScroll
        footerJSX={moreFiltersFooter}
      >
        <div>
          <AdditionalFeaturesFilters
            selectedFeaturesKeys={selectedFeaturesKeys}
            setSelectedFeaturesKeys={setSelectedFeaturesKeys}
            features={features}
            isLoading={isLoading}
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
