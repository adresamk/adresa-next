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
  triggerWidth?: string;
}

export function SelectDemo({
  value,
  options,
  onClick,
  placeholder = "",
  triggerWidth = "180px",
}: SelectDemoProps) {
  return (
    <Select
      value={value}
      onValueChange={(value) => {
        console.log(value);
        onClick(value);
      }}
    >
      <SelectTrigger className={`w-[${triggerWidth}]`}>
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
