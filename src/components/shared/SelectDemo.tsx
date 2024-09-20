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
  name?: string;
}

export function SelectDemo({
  value,
  options,
  onClick,
  placeholder = "",
  triggerWidth = "180px",
  name,
}: SelectDemoProps) {
  return (
    <Select
      name={name}
      value={value}
      onValueChange={(value) => {
        console.log(value);
        onClick(value);
      }}
    >
      <SelectTrigger className={`w-[${triggerWidth}] z-[140] `}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="z-[140] max-h-64 ">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
