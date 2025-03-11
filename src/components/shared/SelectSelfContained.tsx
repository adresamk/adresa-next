"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SelectSelfContainedProps {
  value?: string | null;
  placeholder?: string;
  onClick?: (value: string) => void;
  options: { label: string; value: string }[];
  triggerWidth?: string;
  name?: string;
  id?: string;
  triggerClassName?: string;
}

export function SelectSelfContained({
  value,
  options,
  onClick,
  placeholder = "",
  triggerWidth,
  triggerClassName,
  name,
  id,
}: SelectSelfContainedProps) {
  const [selectValue, setSelectValue] = useState(value);
  return (
    <>
      {/* <Input
        type="hidden"
        name={name}
        value={selectValue}
        onChange={(e) => setSelectValue(e.target.value)}
      /> */}
      <Select
        name={name}
        value={selectValue || undefined}
        onValueChange={(value) => {
          console.log(value);
          setSelectValue(value);
          onClick?.(value);
        }}
      >
        <SelectTrigger
          id={id}
          style={{ width: triggerWidth }}
          className={cn(
            `select-self-contained z-[140] w-fit`,
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-[140] max-h-64">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
