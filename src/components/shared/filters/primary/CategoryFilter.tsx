"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, House } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useSelectedFilter } from "@/hooks/useSelectedFilter";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/hooks/useFilters";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { PropertyCategory } from "@prisma/client";
import { extractFromUrl, replaceFilterInUrl } from "@/lib/filters";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
interface CategoryFilterProps {
  variant: "homepage" | "search";
}
export default function CategoryFilter({ variant }: CategoryFilterProps) {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  const t = useTranslations();
  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter,
  );

  let [category, setCategory] = useState<PropertyCategory>(
    () => extractFromUrl(pathname, "category") as PropertyCategory,
  );

  if (variant === "homepage") {
    category = filters.category;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {variant === "homepage" ? (
          // BIG VARIANT
          <div
            className={cn(
              "h-[90px] w-[185px] overflow-visible rounded-bl-xl border-b-0 border-slate-200 p-4 sm:border-b xl:rounded-bl-none xl:border-t smaller:border-r",
              focusedFilter === "category" &&
                "relative z-20 rounded-t border-b-white bg-white shadow-lg",
              !focusedFilter && "bg-gray-50",
            )}
            onClick={() => {
              setFocusedFilter("category");
            }}
          >
            <div className="">
              <div className="flex flex-col gap-1.5 text-brand-dark-blue">
                <label
                  className="flex h-5 w-full items-center gap-2"
                  htmlFor={"category"}
                >
                  {<House className="h-4 w-4" />}
                  {t("search.filters.category.label")}
                </label>
                <div className="flex h-10 items-center text-sm">
                  {(category && t(`search.filters.category.${category}`)) || (
                    <span className="text-gray-400">
                      {t("search.filters.category.emptyPlaceholder")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="h-8 rounded-xl px-2 py-0.5 md:h-10 md:px-5 md:py-2"
            onClick={() => {
              console.log(category);
            }}
          >
            <span className="capitalize">
              {category
                ? t(`search.filters.category.${category}`)
                : t("search.filters.category.label")}
            </span>
            <ChevronDown width={20} className="h-4 w-4 md:ml-2 md:h-5 md:w-5" />{" "}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent asChild align="start" className="testt">
        <ul className="relative rounded bg-white p-2 text-sm shadow-lg">
          {Object.values(PropertyCategory).map(
            (_category: PropertyCategory) => (
              <li
                key={_category}
                className={cn(
                  "cursor-pointer rounded px-2 py-1 hover:bg-green-50",
                  category === _category && "bg-green-50 text-brand-dark-blue",
                )}
                onClick={() => {
                  if (variant === "homepage") {
                    updateFilters({
                      category: _category,
                    });
                  } else {
                    if (pathname) {
                      const newPath = replaceFilterInUrl(
                        pathname,
                        "category",
                        _category,
                        searchParams,
                      );

                      window.history.replaceState(
                        null,
                        "",
                        `${newPath}${searchParams ? `?${searchParams.toString()}` : ""}`,
                      );
                      // router.replace(newPath);
                    }
                    // setCategory(_category);
                  }
                  setIsOpen(false);
                }}
              >
                {t(`search.filters.category.${_category}`)}
              </li>
            ),
          )}
        </ul>
      </PopoverContent>{" "}
    </Popover>
  );
}
