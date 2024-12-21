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
import { extractFromUrl } from "@/lib/filters";
import { usePathname } from "next/navigation";
interface CategoryFilterProps {
  variant: "homepage" | "search";
}
export default function CategoryFilter({ variant }: CategoryFilterProps) {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  const t = useTranslations();
  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter,
  );

  let [category, setCategory] = useState<PropertyCategory | "">(
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
                  {t("common.filters.category.label")}
                </label>
                <div className="flex h-10 items-center text-sm">
                  {(category && t(`common.filters.category.${category}`)) || (
                    <span className="text-gray-400">
                      {t("common.filters.category.emptyPlaceholder")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="h-8 px-1 py-0.5 md:h-10 md:px-2 md:py-1"
            onClick={() => {
              console.log(category);
            }}
          >
            <span className="capitalize">
              {category
                ? t(`common.filters.category.${category}`)
                : t("common.filters.category.label")}
            </span>
            <ChevronDown width={20} className="h-4 w-4 md:ml-2 md:h-5 md:w-5" />{" "}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent asChild align="start" className="testt">
        <ul className="relative rounded bg-white p-2 text-sm shadow-lg">
          {Object.values(PropertyCategory).map((_type: PropertyCategory) => (
            <li
              key={_type}
              className={cn(
                "cursor-pointer rounded px-2 py-1 hover:bg-green-50",
                category === _type && "bg-green-50 text-brand-dark-blue",
              )}
              onClick={() => {
                if (variant === "homepage") {
                  updateFilters({
                    category: _type,
                  });
                } else {
                  setCategory(_type);
                }
                setIsOpen(false);
              }}
            >
              {t(`common.filters.category.${_type}`)}
            </li>
          ))}
        </ul>
      </PopoverContent>{" "}
    </Popover>
  );
}
