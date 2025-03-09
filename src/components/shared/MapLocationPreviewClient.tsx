// src/components/shared/MapLocationPreviewClient.tsx
"use client"; // This makes it a Client Component
import { LocationPrecision } from "@prisma/client";
import dynamicImport from "next/dynamic";

const MapLocationPreview = dynamicImport(
  () => import("@/components/shared/MapLocationPreview"),
  {
    ssr: false, // Disable server-side rendering
  },
);

export default function MapLocationPreviewClient({
  coordinates,
  locationPrecision,
  pinPopupText,
  isAgency,
}: {
  coordinates: {
    latitude: number | null;
    longitude: number | null;
  };
  locationPrecision: LocationPrecision;
  pinPopupText: string;
  isAgency?: boolean;
}) {
  return (
    <MapLocationPreview
      coordinates={coordinates}
      locationPrecision={locationPrecision}
      pinPopupText={pinPopupText}
      isAgency={isAgency}
    />
  );
}
