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
  triggerClassName?: string;
}

export function SelectDemo({
  value,
  options,
  onClick,
  placeholder = "",
  // triggerWidth = "180px",
  triggerWidth,
  name,
  disabled,
  align = "start",
  triggerClassName = "",
}: SelectDemoProps) {
  const [selectValue, setSelectValue] = React.useState(value);

  return (
    <Select
      disabled={disabled}
      name={name}
      value={selectValue || undefined}
      onValueChange={(value) => {
        onClick?.(value);
        setSelectValue(value);
      }}
    >
      <SelectTrigger
        className={`w-[${triggerWidth}] z-[140] ${triggerClassName}`}
      >
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
