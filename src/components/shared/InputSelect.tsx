"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "../ui/label";
import { set } from "react-hook-form";
import { getPlaceInfo } from "@/lib/data/macedoniaOld/importantData";

type InputSelectOptions = {
  label: string;
  value: string;
};
type InputSelectProps = {
  options: InputSelectOptions[];
  required?: boolean;
  name?: string;
  label: string;
  defaultValue?: string | null;
  notFoundText: string;
  placeholder: string;
  onSelect: (value: string) => void;
  className?: string;
};

export function InputSelect({
  options,
  required = false,
  name,
  label,
  defaultValue = null,
  notFoundText,
  placeholder,
  onSelect,
  className,
}: InputSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery]);

  const handleSelect = useCallback(
    (currentValue: string) => {
      setValue(currentValue);
      setOpen(false);
      onSelect(currentValue);
    },
    [onSelect],
  );

  return (
    <div className={cn("grid w-full gap-1.5", className)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            required && "after:ml-0.5 after:text-red-500 after:content-['*']",
          )}
        >
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={label}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground",
            )}
            // id={name}
            // name={name}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`${label.toLowerCase()}...`}
              className="h-9"
              onValueChange={setSearchQuery}
              value={searchQuery}
            />
            <CommandList>
              <CommandEmpty>{notFoundText}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
