// src/components/shared/MapLocationPreviewClient.tsx
"use client"; // This makes it a Client Component
import dynamic from "next/dynamic";
import { Listing, Agency } from "@prisma/client";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

function MapLoadingPlaceholder() {
  const t = useTranslations();
  return (
    <div className="order-2 mb-10 h-[300px] shrink-0 overflow-hidden border lg:sticky lg:top-[150px] lg:z-20 lg:h-[calc(100vh_-_150px)]">
      {t("map.loading")}
    </div>
  );
}

// Move dynamic import outside of component to maintain instance
const SearchMap = dynamic(
  () =>
    import("@/app/[locale]/search/[[...queryParams]]/_components/SearchMap"),
  {
    ssr: false,
    loading: MapLoadingPlaceholder,
  },
);

export default function SearchMapClient({
  listings,
  agency,
}: {
  listings: Listing[];
  agency?: Agency;
}) {
  return (
    <div className="transition-opacity duration-300 lg:w-2/5">
      <Suspense fallback={<MapLoadingPlaceholder />}>
        <SearchMap listings={listings} agency={agency} />
      </Suspense>
    </div>
  );
}
