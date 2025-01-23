"use client"; // This makes it a Client Component
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const MapWithCustomPane = dynamic(
  () => import("@/app/[locale]/maptest/MapWithCustomPane"),
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

export default function MapWithCustomPaneClient() {
  return <MapWithCustomPane />;
}
