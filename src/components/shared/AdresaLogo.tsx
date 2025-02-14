"use client";

import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
export default function AdresaLogo() {
  const locale = useLocale();
  // console.log("locale", locale);
  return (
    <Link href="/">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          locale === "mk"
            ? "/assets/adresa-logo.png"
            : "/assets/adresa-logo-eng.png"
        }
        width={240}
        height={50}
        alt="Adresa Homepage"
        className="min-w-[90px]"
      />
    </Link>
  );
}
