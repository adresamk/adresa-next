"use client";

import React, { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { routing, usePathname, useRouter, Locale } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

const LanguagePicker = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const localeToNameMap = {
    mk: "Македонски",
    al: "Shqip",
    en: "English",
  };

  const shortLocaleToNameMap = {
    mk: "мкд",
    al: "shq",
    en: "en",
  };

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Globe className="h-4 w-4" />
      <Select
        defaultValue={locale || "en"}
        onValueChange={function (nextLocale) {
          router.replace(
            // @ts-expect-error -- TypeScript will validate that only the known 'params'
            // are used in combination with a given 'pathname'. Since the two will
            // always match for the current route, we can safely ignore the error and skip runtime checks.
            { pathname, params },
            {
              locale: nextLocale as Locale,
            },
          );
        }}
      >
        <SelectTrigger className="w-fit border-none p-1 text-brand-dark-blue smaller:w-[118px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent className="z-[110]">
          {routing.locales.map((locale) => (
            <SelectItem key={locale} value={locale}>
              <span className="hidden smaller:inline">
                {localeToNameMap[locale]}
              </span>
              <span className="smaller:hidden">
                {shortLocaleToNameMap[locale]}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default memo(LanguagePicker);
