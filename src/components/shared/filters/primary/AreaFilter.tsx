"use client";
import { cn } from "@/lib/utils";
import { ChevronDown, Tag } from "lucide-react";
import { areaFilterOptions } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilters } from "@/hooks/useFilters";
import { useSelectedFilter } from "@/hooks/useSelectedFilter";
import { Button } from "@/components/ui/button";
import { parseAsString, useQueryState } from "nuqs";
import { set } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { extractFromUrl, replaceFilterInUrl } from "@/lib/filters";
import { useRouter } from "@/i18n/routing";

interface AreaFilterProps {
  variant: "homepage" | "search";
}
export default function AreaFilter({ variant }: AreaFilterProps) {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  const [isOpen, setIsOpen] = useState(false);
  const [selectionClicked, setSelectionClicked] = useState({
    areaLow: false,
    areaHigh: false,
  });
  const router = useRouter();
  const t = useTranslations();
  const pathname = usePathname();
  let [areaLow, setAreaLow] = useState(() =>
    extractFromUrl(pathname, "areaLow"),
  );
  let [areaHigh, setAreaHigh] = useState(() =>
    extractFromUrl(pathname, "areaHigh"),
  );

  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);

  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter,
  );

  //effect description
  useEffect(() => {
    if (!isOpen) {
      setSelectionClicked({
        areaLow: false,
        areaHigh: false,
      });
    }
  }, [isOpen]);
  useEffect(() => {
    if (selectionClicked.areaLow && selectionClicked.areaHigh) {
      setIsOpen(false);
    }
  }, [selectionClicked]);

  if (variant === "homepage") {
    areaLow = filters.areaLow;
    areaHigh = filters.areaHigh;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {variant === "homepage" ? (
          <div
            className={cn(
              "h-[90px] w-[180px] overflow-visible border-b border-slate-200 p-4 xl:border-t",
              focusedFilter === "area" && "z-10 rounded-t bg-white shadow-lg",
              !focusedFilter && "bg-gray-50",
            )}
            onClick={() => {
              setFocusedFilter("area");
            }}
          >
            <div className="">
              <div className="flex flex-col gap-1.5 text-brand-dark-blue">
                <label className="flex h-5 w-full items-center gap-2">
                  {<Tag className="h-4 w-4" />}{" "}
                  {t("common.filters.surface.label")}
                </label>
                <div className="flex h-10 items-center text-sm">
                  {/* both are set */}
                  {areaLow && areaHigh && (
                    <span className="text-brand-dark-blue">
                      {areaLow} - {areaHigh} m²
                    </span>
                  )}

                  {/* only from is set */}
                  {areaLow && !areaHigh && (
                    <span className="text-brand-dark-blue">
                      {t("common.filters.surface.from")} {areaLow} m²
                    </span>
                  )}

                  {/* only to is set */}
                  {!areaLow && areaHigh && (
                    <span className="text-brand-dark-blue">
                      {t("common.filters.surface.upTo")} {areaHigh} m²
                    </span>
                  )}
                  {/* nothing is set */}
                  {!areaLow && !areaHigh && (
                    <span className="tracking-tighter text-gray-400">
                      m² {t("common.filters.surface.from")} -{" "}
                      {t("common.filters.surface.to")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : variant === "search" ? (
          <Button
            variant="outline"
            className="h-8 px-1 py-0.5 md:h-10 md:px-2 md:py-1"
          >
            <div className="flex h-10 items-center text-sm">
              {/* both are set */}
              {areaLow && areaHigh && (
                <span className="">
                  {areaLow} - {areaHigh} m²
                </span>
              )}

              {/* only from is set */}
              {areaLow && !areaHigh && (
                <span className="">
                  {t("common.filters.surface.from")} {areaLow} m²
                </span>
              )}

              {/* only to is set */}
              {!areaLow && areaHigh && (
                <span className="">
                  {t("common.filters.surface.upTo")} {areaHigh} m²
                </span>
              )}
              {/* nothing is set */}
              {!areaLow && !areaHigh && (
                <span className="tracking-tighter">
                  {t("common.filters.surface.label")}
                </span>
              )}
            </div>
            <ChevronDown width={20} className="h-4 w-4 md:ml-2 md:h-5 md:w-5" />{" "}
          </Button>
        ) : null}
      </PopoverTrigger>
      <PopoverContent asChild align="start">
        <div
          className={cn(
            "relative flex rounded p-0 shadow-lg",
            variant === "homepage" && "w-[418px]",
            variant === "search" && "w-[300px]",
          )}
        >
          <div
            className={cn(
              "rounded bg-white py-3",
              variant === "homepage" && "w-[209px] px-5",
              variant === "search" && "w-[150px] px-2",
            )}
          >
            <div className="mb-1.5 focus-within:text-brand-dark-blue">
              <label htmlFor="area-from" className="text-xs">
                {t("common.filters.surface.from")}
              </label>
              <input
                className="w-full rounded border border-gray-300 p-1 px-4 text-black"
                name="area-from"
                id="area-from"
                type="text"
                placeholder="10,000"
                value={areaLow}
                onChange={(e) => {
                  if (variant === "homepage") {
                    updateFilters({
                      areaLow: e.target.value,
                    });
                  } else {
                    const newPath = replaceFilterInUrl(
                      pathname,
                      "areaLow",
                      e.target.value,
                    );
                    router.push(newPath);
                    // setAreaLow(e.target.value);
                  }
                  setSelectionClicked({
                    ...selectionClicked,
                    areaLow: true,
                  });
                }}
              />
            </div>
            <ul className="relative max-h-[175px] overflow-y-auto rounded bg-white p-2 text-sm">
              {areaFilterOptions.map((area) => (
                <li
                  key={area}
                  className={cn(
                    "cursor-pointer rounded px-2 py-1 hover:bg-green-50",
                    areaLow === area && "bg-green-50 text-brand-dark-blue",
                    areaLow === "" &&
                      area === "Any" &&
                      "bg-green-50 text-brand-dark-blue",
                  )}
                  onClick={() => {
                    if (variant === "homepage") {
                      updateFilters({
                        areaLow: area === "Any" ? "" : area,
                      });
                    } else {
                      const newPath = replaceFilterInUrl(
                        pathname,
                        "areaLow",
                        area === "Any" ? "" : area,
                      );
                      router.push(newPath);
                      // setAreaLow(area === "Any" ? "" : area);
                    }
                    setSelectionClicked({
                      ...selectionClicked,
                      areaLow: true,
                    });
                  }}
                >
                  {area === "Any" ? t("common.filters.surface.any") : area}
                </li>
              ))}
            </ul>
          </div>
          <div
            className={cn(
              "rounded-brbg-white rounded-tr py-3",
              variant === "homepage" && "w-[229px] px-5",
              variant === "search" && "w-[150px] px-2",
            )}
          >
            <div className="mb-1.5 focus-within:text-brand-dark-blue">
              <label htmlFor="area-to" className="text-xs">
                m² {t("common.filters.surface.upTo")}
              </label>
              <input
                className="w-full rounded border border-gray-300 p-1 px-4 text-black"
                name="area-to"
                id="area-to"
                type="text"
                placeholder="10,000"
                value={areaHigh}
                onChange={(e) => {
                  if (variant === "homepage") {
                    updateFilters({
                      areaHigh: e.target.value,
                    });
                  } else {
                    const newPath = replaceFilterInUrl(
                      pathname,
                      "areaHigh",
                      e.target.value,
                    );
                    router.push(newPath);
                    // setAreaHigh(e.target.value);
                  }
                  setSelectionClicked({
                    ...selectionClicked,
                    areaHigh: true,
                  });
                }}
              />
            </div>
            <ul className="relative max-h-[175px] overflow-y-auto rounded rounded-t-none bg-white p-2 text-sm">
              {areaFilterOptions.map((area) => (
                <li
                  key={area}
                  className={cn(
                    "cursor-pointer rounded px-2 py-1 hover:bg-green-50",
                    areaHigh === area && "bg-green-50 text-brand-dark-blue",
                    areaHigh === "" &&
                      area === "Any" &&
                      "bg-green-50 text-brand-dark-blue",
                  )}
                  onClick={() => {
                    if (variant === "homepage") {
                      updateFilters({
                        areaHigh: area === "Any" ? "" : area,
                      });
                    } else {
                      const newPath = replaceFilterInUrl(
                        pathname,
                        "areaHigh",
                        area === "Any" ? "" : area,
                      );
                      router.push(newPath);
                      // setAreaHigh(area === "Any" ? "" : area);
                    }
                    setSelectionClicked({
                      ...selectionClicked,
                      areaHigh: true,
                    });
                  }}
                >
                  {area === "Any" ? t("common.filters.surface.any") : area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
