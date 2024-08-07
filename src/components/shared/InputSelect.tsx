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
import { useState } from "react";
import { Label } from "../ui/label";
import { set } from "react-hook-form";

type InputSelectOptions = {
  label: string;
  value: string;
};
type InputSelectProps = {
  options: InputSelectOptions[];
  required?: boolean;
  label: string;
  defaultValue?: string;
  notFoundText: string;
  placeholder: string;
  onSelect: (value: string) => void;
};

export function InputSelect({
  options,
  required,
  label,
  defaultValue,
  notFoundText,
  placeholder,
  onSelect,
}: InputSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex flex-col mb-2 ">
      <div className="mb-2">
        <Label>{label}</Label>{" "}
        {required && <span className="text-red-500">*</span>}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "max-w-[400px] justify-between",
              !defaultValue && "text-muted-foreground"
            )}
          >
            {defaultValue
              ? options.find(
                  (option) => option.value === defaultValue
                )?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className=" max-w-[400px] p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{notFoundText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    value={option.label}
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
                        option.value === value
                          ? "opacity-100"
                          : "opacity-0"
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
  );
}
