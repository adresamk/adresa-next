// src/components/shared/MapLocationPreviewClient.tsx
"use client"; // This makes it a Client Component
import dynamic from "next/dynamic";
import { Listing, Agency } from "@prisma/client";
import { Suspense } from "react";

const SearchMap = dynamic(
  () => import("@/app/[locale]/search/_components/SearchMap"),
  {
    ssr: false,
    loading: () => <MapLoadingPlaceholder />,
  },
);

function MapLoadingPlaceholder() {
  return (
    <div className="order-2 mb-10 h-[300px] shrink-0 overflow-hidden border lg:sticky lg:top-[150px] lg:z-20 lg:h-[calc(100vh_-_150px)] lg:w-2/5">
      Loading map...
    </div>
  );
}

export default function SearchMapClient({
  listings,
  agency,
}: {
  listings: Listing[];
  agency?: Agency;
}) {
  return (
    <Suspense fallback={<MapLoadingPlaceholder />}>
      <SearchMap listings={listings} agency={agency} />
    </Suspense>
  );
}
