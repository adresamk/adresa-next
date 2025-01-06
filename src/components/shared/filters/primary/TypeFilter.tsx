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
import { useQueryState } from "nuqs";
import { useFilters } from "@/hooks/useFilters";
import { useTranslations } from "next-intl";
import { listingTypeOptions } from "@/lib/data/listing/importantData";
import { PropertyCategory, PropertyType } from "@prisma/client";
import { useState } from "react";

import { extractFromUrl, replaceFilterInUrl } from "@/lib/filters";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
interface TypeFilterProps {
  variant: "homepage" | "search";
}
export default function TypeFilter({ variant }: TypeFilterProps) {
  const filters = useFilters((store) => store.filters);
  const t = useTranslations("");
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = useFilters((store) => store.updateFilters);
  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);

  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter,
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  let [category, setCategory] = useState<PropertyCategory | "">(
    () => extractFromUrl(pathname, "category") as PropertyCategory,
  );
  let [type, setType] = useState<PropertyType | "">(
    () => extractFromUrl(pathname, "type") as PropertyType,
  );
  if (variant === "homepage") {
    type = filters.type;
  }
  const typeOptions = category
    ? ["all_types", ...listingTypeOptions[category as PropertyCategory]]
    : [];
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {variant === "homepage" ? (
          // BIG VARIANT
          <div
            className={cn(
              "h-[90px] w-[185px] overflow-visible border-r border-r-black p-4",
              focusedFilter === "type" && "z-10 rounded-t bg-white shadow-lg",
              !focusedFilter && "bg-gray-50",
            )}
            onClick={() => {
              setFocusedFilter("type");
            }}
          >
            <div className="">
              <div className="flex flex-col gap-1.5 text-brand-dark-blue">
                <label
                  className="flex h-5 w-full items-center gap-2"
                  htmlFor={"property-type"}
                >
                  {<House size={22} />} {"Property Type"}
                </label>
                <div className="flex h-10 items-center text-sm">
                  {category && type
                    ? t(`common.filters.type.${type}`)
                    : t("common.filters.type.emptyPlaceholder")}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="h-8 px-1 py-0.5 md:h-10 md:px-2 md:py-1"
          >
            <span className="capitalize">
              {t(`common.filters.type.${type || "all_types"}`)}
            </span>
            <ChevronDown width={20} className="h-4 w-4 md:ml-2 md:h-5 md:w-5" />{" "}
          </Button>
        )}
      </PopoverTrigger>
      {typeOptions.length > 0 && (
        <PopoverContent asChild align="start">
          <ul className="relative rounded bg-white p-2 text-sm shadow-lg">
            {typeOptions.map((ty) => {
              const _type = ty as PropertyType | "all_types";
              return (
                <li
                  key={_type}
                  className={cn(
                    "cursor-pointer rounded px-2 py-1 capitalize hover:bg-green-50",
                    type === _type && "bg-green-50 text-brand-dark-blue",
                    type === "" &&
                      _type === "all_types" &&
                      "bg-green-50 text-brand-dark-blue",
                  )}
                  onClick={() => {
                    if (variant === "homepage") {
                      // ignore all types
                      if (_type !== "all_types") {
                        updateFilters({
                          type: _type,
                        });
                      }
                    } else {
                      if (pathname) {
                        const newPath = replaceFilterInUrl(
                          pathname,
                          "type",
                          _type === "all_types" ? "" : _type,
                          searchParams,
                        );
                        router.push(newPath);
                      }
                      // setType(_type);
                    }
                    setIsOpen(false);
                  }}
                >
                  {t(`common.filters.type.${_type}`)}
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      )}
    </Popover>
  );
}
