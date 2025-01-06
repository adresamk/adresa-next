"use client";
import { cn, formatPrice } from "@/lib/utils";
import { ChevronDown, Tag } from "lucide-react";
import {
  salePriceFilterOptions,
  rentPriceFilterOptions,
} from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelectedFilter } from "@/hooks/useSelectedFilter";
import { useFilters } from "@/hooks/useFilters";
import { Button } from "@/components/ui/button";
import { parseAsString, useQueryState } from "nuqs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { extractFromUrl, replaceFilterInUrl } from "@/lib/filters";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";

interface PriceFilterProps {
  variant: "homepage" | "search";
}
export default function PriceFilter({ variant }: PriceFilterProps) {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  const t = useTranslations();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectionClicked, setSelectionClicked] = useState({
    priceLow: false,
    priceHigh: false,
  });
  const pathname = usePathname();

  //effect description
  useEffect(() => {
    if (!isOpen) {
      setSelectionClicked({
        priceLow: false,
        priceHigh: false,
      });
    }
  }, [isOpen]);
  useEffect(() => {
    if (selectionClicked.priceLow && selectionClicked.priceHigh) {
      setIsOpen(false);
    }
  }, [selectionClicked]);

  let [priceLow, setPriceLow] = useState(() =>
    extractFromUrl(pathname, "priceLow"),
  );
  let [priceHigh, setPriceHigh] = useState(() =>
    extractFromUrl(pathname, "priceHigh"),
  );

  const focusedFilter = useSelectedFilter((store) => store.selectedFilter);

  const setFocusedFilter = useSelectedFilter(
    (store) => store.setSelectedFilter,
  );

  //effect description
  useEffect(() => {
    if (variant === "homepage") {
      setPriceLow("");
      setPriceHigh("");
      updateFilters({
        priceLow: "",
        priceHigh: "",
      });
    }
  }, [filters.transactionType]);

  if (variant === "homepage") {
    priceLow = filters.priceLow ? formatPrice(Number(filters.priceLow)) : "";
    priceHigh = filters.priceHigh ? formatPrice(Number(filters.priceHigh)) : "";
  }
  // console.log("priceLowHigh", priceLow, priceHigh);
  const priceLowValue = priceLow
    ? priceLow.replace(/,/g, "").replace(".", "")
    : "";
  const priceHighValue = priceHigh
    ? priceHigh.replace(/,/g, "").replace(".", "")
    : "";
  // console.log(priceLowValue, priceHighValue);

  let priceFilterOptions: string[] = [];
  if (variant === "homepage") {
    if (filters.transactionType === "sale") {
      priceFilterOptions = salePriceFilterOptions;
    } else {
      priceFilterOptions = rentPriceFilterOptions;
    }
  } else {
    if (pathname && pathname.includes("sale")) {
      priceFilterOptions = salePriceFilterOptions;
    } else {
      priceFilterOptions = rentPriceFilterOptions;
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {variant === "homepage" ? (
          <div
            className={cn(
              "h-[90px] w-[230px] overflow-visible border-b-0 border-r-0 border-slate-200 p-4 sm:border-b sm:border-r xl:border-t",
              focusedFilter === "price" && "z-10 rounded-t bg-white shadow-lg",
              !focusedFilter && "bg-gray-50",
            )}
            onClick={() => {
              setFocusedFilter("price");
            }}
          >
            <div className="">
              <div className="flex flex-col gap-1.5 text-brand-dark-blue">
                <label className="flex h-5 w-full items-center gap-2">
                  {<Tag className="h-4 w-4" />}{" "}
                  {t("common.filters.price.label")}
                </label>
                <div className="flex h-10 items-center text-sm">
                  {/* both are set */}
                  {priceLow && priceHigh && (
                    <span className="text-brand-dark-blue">
                      {priceLow} - {priceHigh} €
                    </span>
                  )}

                  {/* only from is set */}
                  {priceLow && !priceHigh && (
                    <span className="text-brand-dark-blue">
                      {t("common.filters.price.from")} {priceLow} €
                    </span>
                  )}

                  {/* only to is set */}
                  {!priceLow && priceHigh && (
                    <span className="text-brand-dark-blue">
                      {t("common.filters.price.upTo")} {priceHigh} €
                    </span>
                  )}
                  {/* nothing is set */}
                  {!priceLow && !priceHigh && (
                    <span className="tracking-tighter text-gray-400">
                      € {t("common.filters.price.from")} -{" "}
                      {t("common.filters.price.to")}
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
            <span className="capitalize">
              {priceLow && priceHigh && (
                <span className="">
                  {priceLow} - {priceHigh} €
                </span>
              )}

              {/* only from is set */}
              {priceLow && !priceHigh && (
                <span className="">
                  {t("common.filters.price.from")} {priceLow} €
                </span>
              )}

              {/* only to is set */}
              {!priceLow && priceHigh && (
                <span className="">
                  {t("common.filters.price.upTo")} {priceHigh} €
                </span>
              )}
              {/* nothing is set */}
              {!priceLow && !priceHigh && (
                <span className="tracking-tighter">
                  {t("common.filters.price.label")}
                </span>
              )}
            </span>
            <ChevronDown width={20} className="h-4 w-4 md:ml-2 md:h-5 md:w-5" />{" "}
          </Button>
        ) : null}
      </PopoverTrigger>
      <PopoverContent asChild align="start">
        <div
          className={cn(
            "relative flex rounded px-1 shadow-lg",
            variant === "homepage" && "w-[458px]",
            variant === "search" && "w-[300px]",
          )}
        >
          <div
            className={cn(
              "rounded-bl bg-white py-3",
              variant === "homepage" && "w-[229px] px-5",
              variant === "search" && "w-[150px] px-2",
            )}
          >
            <div className="mb-1.5 focus-within:text-brand-dark-blue">
              <label htmlFor="price-from" className="text-xs">
                € {t("common.filters.price.from")}
              </label>
              <input
                className="w-full rounded border border-gray-300 p-1 px-4 text-black"
                name="price-from"
                id="price-from"
                type="text"
                placeholder="10,000"
                value={priceLowValue}
                onChange={(e) => {
                  if (variant === "homepage") {
                    updateFilters({
                      priceLow: e.target.value.replace(/,/g, ""),
                    });
                  } else {
                    if (pathname) {
                      const newPath = replaceFilterInUrl(
                        pathname,
                        "priceLow",
                        e.target.value.replace(/,/g, ""),
                      );
                      router.push(newPath);
                    }
                    // setPriceLow(e.target.value);
                  }
                  setSelectionClicked({
                    ...selectionClicked,
                    priceLow: true,
                  });
                }}
              />
            </div>
            <ul className="relative max-h-[175px] overflow-y-auto rounded rounded-t-none bg-white text-sm">
              {priceFilterOptions.map((price) => (
                <li
                  key={price}
                  className={cn(
                    "cursor-pointer rounded px-2 py-1 hover:bg-green-50",
                    priceLow === price && "bg-green-50 text-brand-dark-blue",
                    priceLow === "" &&
                      price === "Any" &&
                      "bg-green-50 text-brand-dark-blue",
                  )}
                  onClick={() => {
                    if (variant === "homepage") {
                      updateFilters({
                        priceLow:
                          price === "Any" ? "" : price.replace(/,/g, ""),
                      });
                    } else {
                      if (pathname) {
                        const newPath = replaceFilterInUrl(
                          pathname,
                          "priceLow",
                          price === "Any" ? "" : price.replace(/,/g, ""),
                        );
                        router.push(newPath);
                      }
                      // setPriceLow(price === "Any" ? "" : price);
                    }
                    setSelectionClicked({
                      ...selectionClicked,
                      priceLow: true,
                    });
                  }}
                >
                  {price === "Any" ? t("common.filters.price.any") : price}
                </li>
              ))}
            </ul>
          </div>
          <div
            className={cn(
              "rounded-bl bg-white py-3",
              variant === "homepage" && "w-[229px] px-5",
              variant === "search" && "w-[150px] px-2",
            )}
          >
            <div className="mb-1.5 focus-within:text-brand-dark-blue">
              <label htmlFor="price-to" className="text-xs">
                € {t("common.filters.price.upTo")}
              </label>
              <input
                className="w-full rounded border border-gray-300 p-1 px-4 text-black"
                name="price-to"
                id="price-to"
                type="text"
                placeholder="10,000"
                value={priceHighValue}
                onChange={(e) => {
                  if (variant === "homepage") {
                    updateFilters({
                      priceHigh: e.target.value.replace(/,/g, ""),
                    });
                  } else {
                    if (pathname) {
                      const newPath = replaceFilterInUrl(
                        pathname,
                        "priceHigh",
                        e.target.value.replace(/,/g, ""),
                      );
                      router.push(newPath);
                    }
                    // setPriceHigh(e.target.value);
                  }
                  setSelectionClicked({
                    ...selectionClicked,
                    priceHigh: true,
                  });
                }}
              />
            </div>
            <ul className="relative max-h-[175px] overflow-y-auto rounded rounded-t-none bg-white p-2 text-sm">
              {priceFilterOptions.map((price) => (
                <li
                  key={price}
                  className={cn(
                    "cursor-pointer rounded px-2 py-1 hover:bg-green-50",
                    priceHigh === price && "bg-green-50 text-brand-dark-blue",
                    priceHigh === "" &&
                      price === "Any" &&
                      "bg-green-50 text-brand-dark-blue",
                  )}
                  onClick={() => {
                    if (variant === "homepage") {
                      updateFilters({
                        priceHigh:
                          price === "Any" ? "" : price.replace(/,/g, ""),
                      });
                    } else {
                      if (pathname) {
                        const newPath = replaceFilterInUrl(
                          pathname,
                          "priceHigh",
                          price === "Any" ? "" : price.replace(/,/g, ""),
                        );
                        router.push(newPath);
                      }
                      // setPriceHigh(price === "Any" ? "" : price);
                    }
                    setSelectionClicked({
                      ...selectionClicked,
                      priceHigh: true,
                    });
                  }}
                >
                  {price === "Any" ? t("common.filters.price.any") : price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
