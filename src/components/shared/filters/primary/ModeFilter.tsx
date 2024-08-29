"use client";
import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilters } from "@/hooks/useFilters";
import { cn } from "@/lib/utils";
import { Popover } from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
interface ModeFilterProps {
  variant: "homepage" | "search";
}

export default function ModeFilter({ variant }: ModeFilterProps) {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);

  const [label, setLabel] = useState("Available For");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {variant === "homepage" && (
        <div className="flex gap-3">
          <Button
            onClick={() => updateFilters({ mode: "sale" })}
            size={"sm"}
            className={cn(
              "py-0.5 px-4 h-6 font-semibold bg-white text-brand-light-blue hover:bg-slate-50 ",
              filters.mode === "sale" &&
                "bg-blue-400 text-white hover:bg-blue-500",
              filters.mode !== "sale" &&
                "border-brand-light-blue border"
            )}
          >
            Sale
          </Button>
          <Button
            onClick={() => updateFilters({ mode: "rent" })}
            size={"sm"}
            className={cn(
              "py-0.5 px-4 h-6 font-semibold bg-white text-brand-light-blue hover:bg-slate-50",
              filters.mode === "rent" &&
                "bg-blue-400 text-white hover:bg-blue-500",
              filters.mode !== "rent" &&
                "border-brand-light-blue border"
            )}
          >
            Rent
          </Button>
        </div>
      )}

      {variant === "search" && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger className="min-w-24">
            <Button variant="outline">
              <span className="capitalize">
                {filters.mode || "Available For"}
              </span>
              <ChevronDown width={20} className="ml-2" />{" "}
            </Button>
          </PopoverTrigger>
          <PopoverContent asChild align="start">
            <ul className="w-[108px] p-2  relative text-sm  bg-white rounded shadow-lg font-semibold">
              <li
                onClick={() => {
                  updateFilters({ mode: "sale" });
                  setIsOpen(false);
                }}
                className={cn(
                  "px-2.5 mb-0.5 py-2 hover:bg-green-50 cursor-pointer rounded",
                  filters.mode === "sale" &&
                    "bg-green-50 text-brand-dark-blue"
                )}
              >
                Sale
              </li>
              <li
                className={cn(
                  "px-2 py-1 hover:bg-green-50 cursor-pointer rounded",
                  filters.mode === "rent" &&
                    "bg-green-50 text-brand-dark-blue"
                )}
                onClick={() => {
                  updateFilters({ mode: "rent" });
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
