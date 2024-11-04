"use client";
import { Button } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFilters } from "@/hooks/useFilters";
import { cn } from "@/lib/utils";
import { Popover } from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
interface ModeFilterProps {
  variant: "homepage" | "search";
}

export default function ModeFilter({ variant }: ModeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  let [mode, setMode] = useQueryState(
    "mode",
    // TODO: This doesn't set the default value correctly
    parseAsString.withDefault("sale").withOptions({ shallow: false }),
  );
  if (variant === "homepage") {
    mode = filters.mode;
  }
  return (
    <>
      {variant === "homepage" && (
        <div className="flex gap-3">
          <Button
            onClick={() => {
              if (variant === "homepage") {
                updateFilters({
                  mode: "sale",
                });
              } else {
                setMode("sale");
              }
            }}
            size={"sm"}
            className={cn(
              "h-6 bg-white px-4 py-0.5 font-semibold text-brand-light-blue hover:bg-slate-50",
              mode === "sale" && "bg-blue-400 text-white hover:bg-blue-500",
              mode !== "sale" && "border border-brand-light-blue",
            )}
          >
            Sale
          </Button>
          <Button
            onClick={() => {
              updateFilters({
                mode: "rent",
              });
            }}
            size={"sm"}
            className={cn(
              "h-6 bg-white px-4 py-0.5 font-semibold text-brand-light-blue hover:bg-slate-50",
              mode === "rent" && "bg-blue-400 text-white hover:bg-blue-500",
              mode !== "rent" && "border border-brand-light-blue",
            )}
          >
            Rent
          </Button>
        </div>
      )}

      {variant === "search" && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger className="min-w-24" asChild>
            <Button variant="outline">
              <span className="capitalize">{mode || "Available For"}</span>
              <ChevronDown width={20} className="ml-2" />{" "}
            </Button>
          </PopoverTrigger>
          <PopoverContent asChild align="start">
            <ul className="relative w-[108px] rounded bg-white p-2 text-sm font-semibold shadow-lg">
              <li
                onClick={() => {
                  setMode("sale");
                  setIsOpen(false);
                }}
                className={cn(
                  "mb-0.5 cursor-pointer rounded px-2.5 py-2 hover:bg-green-50",
                  mode === "sale" && "bg-green-50 text-brand-dark-blue",
                )}
              >
                Sale
              </li>
              <li
                className={cn(
                  "cursor-pointer rounded px-2 py-1 hover:bg-green-50",
                  mode === "rent" && "bg-green-50 text-brand-dark-blue",
                )}
                onClick={() => {
                  setMode("rent");
                  setIsOpen(false);
                }}
              >
                Rent
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
