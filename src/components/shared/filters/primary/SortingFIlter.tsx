"use client";

import { useTranslations } from "next-intl";
import { SelectDemo } from "../../SelectDemo";
import { useState } from "react";
import { extractFromUrl, replaceFilterInUrl } from "@/lib/filters";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
const sortingOptions = [
  { value: "new", label: "Newest" },
  { value: "low_price", label: "Lowest First" },
  { value: "high_price", label: "Highest First" },
];
export default function SortingFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  let [sorting, setSorting] = useState<string>(
    () => extractFromUrl(pathname, "sorting") as string,
  );
  const t = useTranslations();
  const sortingOptionsTranslated = sortingOptions.map((option) => ({
    ...option,
    label: t(`listing.sorting.${option.value}`),
  }));
  return (
    <SelectDemo
      placeholder={t("listing.labels.sort")}
      triggerWidth="w-fit"
      value={sorting}
      options={sortingOptionsTranslated}
      onClick={(newValue) => {
        if (pathname) {
          const newPath = replaceFilterInUrl(
            pathname,
            "sorting",
            newValue,
            searchParams,
          );
          router.push(newPath);
        }
      }}
    />
  );
}
