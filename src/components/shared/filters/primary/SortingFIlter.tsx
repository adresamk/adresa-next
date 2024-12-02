"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations();
  const sortingOptionsTranslated = sortingOptions.map((option) => ({
    ...option,
    label: t(`common.listing.sorting.${option.value}`),
  }));
  return (
    <SelectDemo
      placeholder={t("common.listing.labels.sort")}
      triggerWidth="100px"
      value={sorting}
      options={sortingOptionsTranslated}
      onClick={(newValue) => {
        setSorting(newValue);
      }}
    />
  );
}
