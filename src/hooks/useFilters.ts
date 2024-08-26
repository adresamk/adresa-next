import {
  FiltersObject,
  modeOptions,
  PartialFiltersObject,
} from "@/lib/types";
import { create } from "zustand";

interface useFiltersStore {
  filters: FiltersObject;
  updateFilters: (newFilters: PartialFiltersObject) => void;
  updateSecondarySearchParams: (router: any) => void;
  clearSecondaryFilters: () => void;
}

export const useFilters = create<useFiltersStore>((set) => ({
  filters: {
    // primary
    mode: "" as modeOptions,
    location: "",
    propertyType: "",
    subType: "",
    priceLow: "",
    priceHigh: "",
    areaLow: "",
    areaHigh: "",
    // secondary
    floorNumberLow: "",
    floorNumberHigh: "",
    bedroomsNumberLow: "",
    bedroomsNumberHigh: "",
    constructionYearLow: "",
    constructionYearHigh: "",
    isNewDevelopment: false,
    heatingType: "",
    isFurnitureIncluded: false,
    externalFeatures: ["ac"],
    internalFeatures: [],
    lastUpdated: "",
    creationDate: "",
  },
  updateFilters: (newFilters: PartialFiltersObject) =>
    set((prevState) => {
      const newState = {
        ...prevState.filters,
        ...newFilters,
      };
      console.log(newState);
      return {
        filters: newState,
      };
    }),

  updateSecondarySearchParams: (router: any) =>
    //@ts-ignore
    set((prevState) => {}),
  clearSecondaryFilters: () =>
    set((prevState) => {
      const secondaryFilters = {
        floorNumberLow: "",
        floorNumberHigh: "",
        bedroomsNumberLow: "",
        bedroomsNumberHigh: "",
        constructionYearLow: "",
        constructionYearHigh: "",
        isNewDevelopment: false,
        heatingType: "",
        isFurnitureIncluded: false,
        externalFeatures: ["ac"],
        internalFeatures: [],
        lastUpdated: "",
        creationDate: "",
      };
      const newState = {
        ...prevState.filters,
        ...secondaryFilters,
      };
      console.log(newState);
      return {
        filters: newState,
      };
    }),
}));
