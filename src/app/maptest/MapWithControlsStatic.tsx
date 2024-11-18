"use client";
import dynamic from "next/dynamic";

const MapWithControls = dynamic(() => import("@/components/MapWithControls"), {
  ssr: false,
});

export default MapWithControls;
