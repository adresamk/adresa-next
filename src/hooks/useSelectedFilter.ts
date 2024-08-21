import { create } from "zustand";

type selectedFilterOptions =
  | "property-type"
  | "location"
  | "area-size"
  | "price"
  | "";
interface useSelectedFilterStore {
  selectedFilter: selectedFilterOptions;
  setSelectedFilter: (value: selectedFilterOptions) => void;
}

export const useSelectedFilter = create<useSelectedFilterStore>(
  (set) => ({
    selectedFilter: "",
    setSelectedFilter: (value: selectedFilterOptions) =>
      set({ selectedFilter: value }),
  })
);
