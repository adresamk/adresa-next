// src/components/shared/MapLocationPreviewClient.tsx
"use client"; // This makes it a Client Component
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const PlacesTestMap = dynamic(
  () => import("@/app/[locale]/maptest/2/PlacesTestMap"),
  {
    ssr: false,
    loading: () => <MapLoadingPlaceholder />,
  },
);

function MapLoadingPlaceholder() {
  const t = useTranslations();
  return (
    <div className="order-2 mb-10 h-[300px] shrink-0 overflow-hidden border lg:sticky lg:top-[150px] lg:z-20 lg:h-[calc(100vh_-_150px)] lg:w-2/5">
      {t("map.loading")}
    </div>
  );
}

export default function PlaceTestMapClient() {
  return <PlacesTestMap />;
}
