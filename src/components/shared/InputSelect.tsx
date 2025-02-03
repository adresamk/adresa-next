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
import { useEffect, useState } from "react";
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
};

export function InputSelect({
  options,
  required,
  name,
  label,
  defaultValue,
  notFoundText,
  placeholder,
  onSelect,
}: InputSelectProps) {
  const [open, setOpen] = useState(false);
  const startingValue = defaultValue ?? "";
  const [value, setValue] = useState(startingValue);

  return (
    <div className="mb-2 flex flex-col">
      <div className="mb-2">
        <Label>{label}</Label>{" "}
        {required && <span className="text-red-500">*</span>}
      </div>
      <div className="relative">
        {name && (
          <input
            type="text"
            value={value}
            onChange={() => {}}
            required={required}
            name={name}
            tabIndex={-1}
            className="sr-only bottom-0 left-10"
          />
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "max-w-[400px] justify-between",
                !defaultValue && "text-muted-foreground",
              )}
            >
              {defaultValue
                ? options.find((option) => option.value === defaultValue)?.label
                : placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="max-w-[400px] p-0">
            <Command>
              <CommandInput placeholder={placeholder} />
              <CommandList>
                <CommandEmpty>{notFoundText}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      value={option.value}
                      key={option.value}
                      onSelect={() => {
                        //   console.log(option.value);
                        setValue(option.value);
                        onSelect(option.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          option.value === value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
