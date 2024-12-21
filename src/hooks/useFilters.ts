import { FiltersObject, PartialFiltersObject } from "@/lib/types";
import { PropertyTransactionType } from "@prisma/client";
import { create } from "zustand";

interface useFiltersStore {
  filters: FiltersObject;
  shouldUpdate: boolean;
  updateFilters: (newFilters: PartialFiltersObject) => void;
  updateSecondarySearchParams: (router: any) => void;
  clearSecondaryFilters: () => void;
}

export const defaultFilters: FiltersObject = {
  // primary
  transactionType: "sale",
  location: "",
  type: "",
  category: "",
  priceLow: "",
  priceHigh: "",
  areaLow: "",
  areaHigh: "",
};
const primaryFilters = [
  "transactionType",
  "location",
  "type",
  "category",
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
      console.log("newFilters", newFilters);
      const primaryFiltersChanged = Object.keys(newFilters).some((key) =>
        primaryFilters.includes(key),
      );

      const newState = {
        ...prevState.filters,
        ...newFilters,
      };
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
      const newState = {
        ...prevState.filters,
      };
      console.log(newState);
      return {
        filters: newState,
      };
    }),
}));
