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

interface SubTypeFilterProps {
  variant: "homepage" | "search";
}
export default function SubTypeFilter({ variant }: SubTypeFilterProps) {
  const filters = useFilters((store) => store.filters);
  const t = useTranslations("");
  const updateFilters = useFilters((store) => store.updateFilters);
  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);
  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter,
  );
  let [propertyType, setPropertyType] = useQueryState("propertyType", {
    shallow: false,
  });
  let [subType, setSubType] = useQueryState("subType", {
    shallow: false,
  });
  if (variant === "homepage") {
    subType = filters.subType;
  }
  const subtypeOptions = propertyType ? listingTypeOptions[propertyType] : [];
  return (
    <Popover>
      <PopoverTrigger asChild>
        {variant === "homepage" ? (
          // BIG VARIANT
          <div
            className={cn(
              "h-[90px] w-[185px] overflow-visible border-r border-r-black p-4",
              focusedFilter === "property-type" &&
                "z-10 rounded-t bg-white shadow-lg",
              !focusedFilter && "bg-gray-50",
            )}
            onClick={() => {
              setFocusedFilter("property-type");
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
                  {propertyType && subType
                    ? t(`common.filters.subType.${subType}`)
                    : t("common.filters.subType.emptyPlaceholder")}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Button variant="outline">
            <span className="capitalize">
              {subType
                ? t(`common.filters.subType.${subType}`)
                : t("common.filters.subType.emptyPlaceholder")}
            </span>
            <ChevronDown width={20} className="ml-2" />{" "}
          </Button>
        )}
      </PopoverTrigger>
      {subtypeOptions.length > 0 && (
        <PopoverContent asChild align="start">
          <ul className="relative w-[184px] rounded bg-white p-2 text-sm shadow-lg">
            {subtypeOptions.map((st: string) => (
              <li
                key={st}
                className={cn(
                  "cursor-pointer rounded px-2 py-1 capitalize hover:bg-green-50",
                  subType === st && "bg-green-50 text-brand-dark-blue",
                )}
                onClick={() => {
                  if (variant === "homepage") {
                    updateFilters({
                      subType: st,
                    });
                  } else {
                    setSubType(st);
                  }
                }}
              >
                {t(`common.filters.subType.${st}`)}
              </li>
            ))}
          </ul>
        </PopoverContent>
      )}
    </Popover>
  );
}
