import {
  FiltersObject,
  modeOptions,
  PartialFiltersObject,
} from "@/lib/types";
import { create } from "zustand";

interface useFiltersStore {
  filters: FiltersObject;
  shouldUpdate: boolean;
  updateFilters: (newFilters: PartialFiltersObject) => void;
  updateSecondarySearchParams: (router: any) => void;
  clearSecondaryFilters: () => void;
}

export const defaultFilters = {
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
};
const primaryFilters = [
  "mode",
  "location",
  "propertyType",
  "subType",
  "priceLow",
  "priceHigh",
  "areaLow",
  "areaHigh",
];
export const useFilters = create<useFiltersStore>((set) => ({
  filters: {
    ...defaultFilters,
  },
  shouldUpdate: false,
  updateFilters: (newFilters: PartialFiltersObject) =>
    set((prevState) => {
      const primaryFiltersChanged = Object.keys(newFilters).some(
        (key) => primaryFilters.includes(key)
      );

      const newState = {
        ...prevState.filters,
        ...newFilters,
      };
      console.log(newState);
      return {
        filters: newState,
        shouldUpdate: primaryFiltersChanged,
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
