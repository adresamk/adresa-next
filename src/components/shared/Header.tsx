import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { HousePlus } from "lucide-react";

import AuthUserControls from "../AuthUserControls/AuthUserControls";
import { createListing } from "@/server/actions/listing.actions";
import { getTranslations } from "next-intl/server";

export default async function Header() {
  const t = await getTranslations();
  return (
    <header className="fixed left-0 right-0 top-0 z-[100] flex h-[80px] items-center justify-between overflow-hidden bg-white px-5 py-2 shadow-lg">
      <nav className="mr-4 flex items-center gap-6 text-brand-dark-blue">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={"/assets/adresa-logo.png"}
            width={240}
            height={50}
            alt="Adresa Homepage"
            className="min-w-[90px]"
          />
        </Link>
      </nav>

      <nav className="flex items-center gap-2">
        {/* <Link href="/listing/new"> */}
        <form action={createListing}>
          <Button size={"sm"} className="flex items-center gap-1.5 px-2.5">
            <HousePlus className="h-5 w-4 md:h-6 md:w-6" />{" "}
            <span className="hidden font-bold uppercase tracking-wide md:inline-block">
              {t("header.createListing")}
            </span>
          </Button>
        </form>
        {/* </Link> */}
        <LocaleSwitcher />

        <AuthUserControls />
      </nav>
    </header>
  );
}
