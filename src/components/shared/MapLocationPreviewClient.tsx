// src/components/shared/MapLocationPreviewClient.tsx
"use client"; // This makes it a Client Component
import dynamicImport from "next/dynamic";

const MapLocationPreview = dynamicImport(
  () => import("@/components/shared/MapLocationPreview"),
  {
    ssr: false, // Disable server-side rendering
  },
);

export default function MapLocationPreviewClient(props: any) {
  return <MapLocationPreview {...props} />;
}
