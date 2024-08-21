import { propertyTypeValues } from "@/lib/types";
import { create } from "zustand";

type modeOptions = "sale" | "rent";

interface FiltersObject {
  mode: modeOptions;
  location: string;
  propertyType: propertyTypeValues[number];
  subType: string;
  priceLow: string;
  priceHigh: string;
  areaLow: string;
  areaHigh: string;
}
type PartialFiltersObject = Partial<FiltersObject>;

interface useFiltersStore {
  filters: FiltersObject;
  updateFilters: (newFilters: PartialFiltersObject) => void;
}

export const useFilters = create<useFiltersStore>((set) => ({
  filters: {
    mode: "" as modeOptions,
    location: "",
    propertyType: "",
    subType: "",
    priceLow: "",
    priceHigh: "",
    areaLow: "",
    areaHigh: "",
  },
  updateFilters: (newFilters: PartialFiltersObject) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    })),
}));
