"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectDemoProps {
  value: string;
  placeholder?: string;
  onClick?: (value: string) => void;
  options: { label: string; value: string; icon?: React.ReactNode }[];
  triggerWidth?: string;
  name?: string;
  disabled?: boolean;
  align?: "start" | "end";
}

export function SelectDemo({
  value,
  options,
  onClick,
  placeholder = "",
  triggerWidth = "180px",
  name,
  disabled,
  align = "start",
}: SelectDemoProps) {
  return (
    <Select
      disabled={disabled}
      name={name}
      value={value}
      onValueChange={(value) => {
        onClick?.(value);
      }}
    >
      <SelectTrigger className={`w-[${triggerWidth}] z-[140]`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="z-[140] max-h-64" align={align}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              {option.icon && option.icon}
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
