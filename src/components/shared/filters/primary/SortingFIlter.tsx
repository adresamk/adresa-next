"use client";

import { SelectDemo } from "../../SelectDemo";
import { parseAsString, useQueryState } from "nuqs";
const sortingOptions = [
  { value: "new", label: "Newest" },
  { value: "lowPrice", label: "Lowest First" },
  { value: "highPrice", label: "Highest First" },
];
export default function SortingFilter() {
  let [sorting, setSorting] = useQueryState(
    "sorting",
    parseAsString.withOptions({ shallow: false }).withDefault("new"),
  );
  return (
    <SelectDemo
      placeholder="Sort"
      triggerWidth="100px"
      value={sorting}
      options={sortingOptions}
      onClick={(newValue) => {
        setSorting(newValue);
      }}
    />
  );
}
