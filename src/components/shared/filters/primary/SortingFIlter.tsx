"use client";

import { useTranslations } from "next-intl";
import { SelectDemo } from "../../SelectDemo";
import { useState } from "react";
import { extractFromUrl, replaceFilterInUrl } from "@/lib/filters";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import {
  ArrowDown,
  ArrowDown01Icon,
  ArrowDown10Icon,
  ArrowUp,
  ArrowUpDown,
  ListRestartIcon,
} from "lucide-react";
const sortingOptions = [
  {
    value: "new",
    label: "Newest",
    icon: <ListRestartIcon className="h-4 w-4" />,
  },
  {
    value: "low_price",
    label: "Lowest First",
    icon: <ArrowDown01Icon className="h-4 w-4" />,
  },
  {
    value: "high_price",
    label: "Highest First",
    icon: <ArrowDown10Icon className="h-4 w-4" />,
  },
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
    icon: option.icon,
  }));
  return (
    <SelectDemo
      placeholder={t("listing.labels.sort")}
      triggerWidth="w-fit"
      value={sorting}
      align="end"
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
