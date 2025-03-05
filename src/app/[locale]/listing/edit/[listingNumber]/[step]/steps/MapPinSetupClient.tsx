// src/components/shared/MapLocationPreviewClient.tsx
"use client"; // This makes it a Client Component
import dynamic from "next/dynamic";
import { Listing } from "@prisma/client";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
// import MapPinSetup from "./MapPinSetup";

const MapPinSetup = dynamic(
  () =>
    import(
      "@/app/[locale]/listing/edit/[listingNumber]/[step]/steps/MapPinSetup"
    ),
  {
    ssr: false,
    loading: () => <MapLoadingPlaceholder />,
  },
);

function MapLoadingPlaceholder() {
  const t = useTranslations();
  return (
    <div className="order-2 mb-10 w-full shrink-0 overflow-hidden border lg:sticky lg:top-[150px] lg:z-20 lg:h-[calc(100vh_-_150px)]">
      {t("map.loading")}
    </div>
  );
}

export default function SearchMapClient({
  listing,
  municipality,
}: {
  listing: Listing;
  municipality: string;
}) {
  return <MapPinSetup listing={listing} municipality={municipality} />;
}
