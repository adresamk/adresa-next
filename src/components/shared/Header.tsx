import { Suspense } from "react";
import Dynamic from "./Dynamic";
import AdresaLogo from "./AdresaLogo";

export default async function Header() {
  return (
    <header
      data-aria-hidden="false"
      aria-hidden="false"
      className="fixed left-0 right-0 top-0 z-[100] flex h-[60px] items-center justify-between overflow-hidden bg-white px-5 py-2 shadow-lg md:h-[80px]"
    >
      <nav className="mr-4 flex items-center gap-6 text-brand-dark-blue">
        <AdresaLogo />
        <div className="hidden">2</div>
      </nav>

      <Suspense fallback={<div>Loading...</div>}>
        <nav className="flex items-center gap-2">
          <Dynamic />
        </nav>
      </Suspense>
    </header>
  );
}
