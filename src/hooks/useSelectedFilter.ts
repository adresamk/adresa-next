import { create } from "zustand";

type selectedFilterOptions =
  | "location"
  | "area"
  | "price"
  | "transactionType"
  | "category"
  | "";
interface useSelectedFilterStore {
  selectedFilter: selectedFilterOptions;
  setSelectedFilter: (value: selectedFilterOptions) => void;
}

export const useSelectedFilter = create<useSelectedFilterStore>((set) => ({
  selectedFilter: "",
  setSelectedFilter: (value: selectedFilterOptions) =>
    set({ selectedFilter: value }),
}));
