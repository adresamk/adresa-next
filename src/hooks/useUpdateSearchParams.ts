import { FiltersObject } from "@/lib/types";
import { createContext, useContext } from "react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useFilters } from "./useFilters";

export const useUpdateSearchParams = () => {
  const router = useRouter();
  const filters = useFilters((store) => store.filters);

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

  const updateSearchParams = useCallback(
    (newSearchParams: Partial<FiltersObject>) => {
      const currentSearchParams = new URLSearchParams(router.asPath);
      Object.entries(newSearchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          currentSearchParams.set(key, String(value));
        } else {
          currentSearchParams.delete(key);
        }
      });
      console.log("this happens");
      router.push(`${router.pathname}?${currentSearchParams.toString()}`);
    },
    [router],
  );

  const updateSecondarySearchParams = useCallback(() => {
    const currentSearchParams = new URLSearchParams(router.asPath);
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
    Object.entries(secondaryFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        currentSearchParams.set(key, String(value));
      } else {
        currentSearchParams.delete(key);
      }
    });
    router.push(`${router.pathname}?${currentSearchParams.toString()}`);
  }, [
    filters.bedroomsNumberHigh,
    filters.bedroomsNumberLow,
    filters.constructionYearHigh,
    filters.constructionYearLow,
    filters.creationDate,
    filters.externalFeatures,
    filters.floorNumberHigh,
    filters.floorNumberLow,
    filters.heatingType,
    filters.internalFeatures,
    filters.isFurnitureIncluded,
    filters.isNewDevelopment,
    filters.lastUpdated,
    router,
  ]);

  return { updateSearchParams, updateSecondarySearchParams };
};
