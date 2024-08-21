import { propertyTypeValues } from "@/lib/types";
import { create } from "zustand";

type modeOptions = "sale" | "rent";

interface FiltersObject {
  mode: modeOptions;
  location: string;
  propertyType: propertyTypeValues[number];
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
    mode: "sale" as modeOptions,
    location: "",
    propertyType: "Apartment",
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
