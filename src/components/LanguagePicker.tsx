"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function LanguagePicker() {
  const [language, setLanguage] = useState("mk");
  return (
    <Select
      value={language}
      onValueChange={function (value) {
        setLanguage(value);
      }}
    >
      <SelectTrigger className="w-[52px] p-1 border-none text-brand-dark-blue">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="z-[110]">
        <SelectItem value="mk">MK</SelectItem>
        <SelectItem value="al">AL</SelectItem>
        <SelectItem value="en">EN</SelectItem>
      </SelectContent>
    </Select>
  );
}
