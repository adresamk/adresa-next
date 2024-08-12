import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectDemoProps {
  value: string;
  placeholder?: string;
  onClick: (value: string) => void;
  options: { label: string; value: string }[];
}

export function SelectDemo({
  value,
  options,
  onClick,
  placeholder = "",
}: SelectDemoProps) {
  return (
    <Select
      value={value}
      onValueChange={(value) => {
        console.log(value);
        onClick(value);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
