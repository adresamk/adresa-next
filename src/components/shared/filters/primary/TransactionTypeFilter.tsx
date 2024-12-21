"use client";
import { Button } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFilters } from "@/hooks/useFilters";
import { extractFromUrl, replaceFilterInUrl } from "@/lib/filters";
import { cn } from "@/lib/utils";
import { PropertyTransactionType } from "@prisma/client";
import { Popover } from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
interface TransactionTypeProps {
  variant: "homepage" | "search";
}

export default function TransactionType({ variant }: TransactionTypeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filters = useFilters((store) => store.filters);
  const router = useRouter();

  const t = useTranslations();
  const updateFilters = useFilters((store) => store.updateFilters);
  const pathname = usePathname();
  let [transactionType, setTransactionType] = useState<PropertyTransactionType>(
    // TODO: This doesn't set the default value correctly
    () =>
      extractFromUrl(pathname, "transactionType") as PropertyTransactionType,
  );
  if (variant === "homepage") {
    transactionType = filters.transactionType;
  }
  return (
    <>
      {variant === "homepage" && (
        <div className="flex gap-3">
          <Button
            onClick={() => {
              if (variant === "homepage") {
                updateFilters({
                  transactionType: "sale",
                });
              } else {
                setTransactionType("sale");
              }
            }}
            size={"sm"}
            className={cn(
              "h-6 bg-white px-4 py-0.5 font-semibold text-brand-light-blue hover:bg-slate-50",
              transactionType === "sale" &&
                "bg-blue-400 text-white hover:bg-blue-500",
              transactionType !== "sale" && "border border-brand-light-blue",
            )}
          >
            {t("common.filters.mode.sale")}
          </Button>
          <Button
            onClick={() => {
              updateFilters({
                transactionType: "rent",
              });
            }}
            size={"sm"}
            className={cn(
              "h-6 bg-white px-4 py-0.5 font-semibold text-brand-light-blue hover:bg-slate-50",
              transactionType === "rent" &&
                "bg-blue-400 text-white hover:bg-blue-500",
              transactionType !== "rent" && "border border-brand-light-blue",
            )}
          >
            {t("common.filters.mode.rent")}
          </Button>
        </div>
      )}

      {variant === "search" && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger className="" asChild>
            <Button
              variant="outline"
              className="h-8 px-1 py-0.5 md:h-10 md:px-2 md:py-1"
            >
              <span className="capitalize">
                {transactionType
                  ? t(`common.filters.mode.${transactionType}`)
                  : t("common.filters.mode.availableFor")}
              </span>
              <ChevronDown
                width={20}
                className="h-4 w-4 md:ml-2 md:h-5 md:w-5"
              />{" "}
            </Button>
          </PopoverTrigger>
          <PopoverContent asChild align="start">
            <ul className="relative rounded bg-white p-2 text-sm shadow-lg">
              <li
                onClick={() => {
                  // setTransactionType("sale");
                  setIsOpen(false);
                  const newPath = replaceFilterInUrl(
                    pathname,
                    "transactionType",
                    "sale",
                  );
                  console.log("newPath", newPath);
                  router.push(newPath);
                }}
                className={cn(
                  "mb-0.5 cursor-pointer rounded px-2.5 py-2 hover:bg-green-50",
                  transactionType === "sale" &&
                    "bg-green-50 text-brand-dark-blue",
                )}
              >
                {t("common.filters.mode.sale")}
              </li>
              <li
                className={cn(
                  "cursor-pointer rounded px-2 py-1 hover:bg-green-50",
                  transactionType === "rent" &&
                    "bg-green-50 text-brand-dark-blue",
                )}
                onClick={() => {
                  setIsOpen(false);
                  // setTransactionType("rent");
                  const newPath = replaceFilterInUrl(
                    pathname,
                    "transactionType",
                    "rent",
                  );
                  console.log("newPath", newPath);
                  router.push(newPath);
                }}
              >
                {t("common.filters.mode.rent")}
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
