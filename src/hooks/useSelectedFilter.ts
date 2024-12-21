import { create } from "zustand";

type selectedFilterOptions =
  | "type"
  | "location"
  | "area"
  | "price"
  | "transactionType"
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
