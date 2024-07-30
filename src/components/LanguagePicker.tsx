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
    <div className="language-select">
      <Select
        value={language}
        onValueChange={function (value) {
          setLanguage(value);
        }}
      >
        <SelectTrigger className="w-[80px] border-none">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mk">MK</SelectItem>
          <SelectItem value="al">AL</SelectItem>
          <SelectItem value="en">EN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
