import { Link } from "@/i18n/routing";
import LocaleSwitcher from "@/components/LocaleSwitcher";

import AuthUserControls from "../AuthUserControls/AuthUserControls";
import NewListingButton from "../NewListingButton";
import { getLocale } from "next-intl/server";

export default async function Header() {
  const locale = await getLocale();
  return (
    <header className="fixed left-0 right-0 top-0 z-[100] flex h-[60px] items-center justify-between overflow-hidden bg-white px-5 py-2 shadow-lg md:h-[80px]">
      <nav className="mr-4 flex items-center gap-6 text-brand-dark-blue">
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
      </nav>

      <nav className="flex items-center gap-2">
        <NewListingButton />
        <LocaleSwitcher />
        <AuthUserControls />
      </nav>
    </header>
  );
}
