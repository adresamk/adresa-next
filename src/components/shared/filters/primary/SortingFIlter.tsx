"use client";

import { useTranslations } from "next-intl";
import { SelectDemo } from "../../SelectDemo";
import { parseAsString, useQueryState } from "nuqs";
import { PropertyCategory } from "@prisma/client";
import { useState } from "react";
import { extractFromUrl, replaceFilterInUrl } from "@/lib/filters";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
const sortingOptions = [
  { value: "new", label: "Newest" },
  { value: "low_price", label: "Lowest First" },
  { value: "high_price", label: "Highest First" },
];
export default function SortingFilter() {
  const pathname = usePathname();
  const router = useRouter();
  let [sorting, setSorting] = useState<string>(
    () => extractFromUrl(pathname, "sorting") as string,
  );
  const t = useTranslations();
  const sortingOptionsTranslated = sortingOptions.map((option) => ({
    ...option,
    label: t(`common.listing.sorting.${option.value}`),
  }));
  return (
    <SelectDemo
      placeholder={t("common.listing.labels.sort")}
      triggerWidth="w-fit"
      value={sorting}
      options={sortingOptionsTranslated}
      onClick={(newValue) => {
        if (pathname) {
          const newPath = replaceFilterInUrl(pathname, "sorting", newValue);
          router.push(newPath);
        }
      }}
    />
  );
}
