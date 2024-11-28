"use client";
import { LatLngExpression } from "leaflet";
import { CircleMarker, MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import { useTranslations } from "next-intl";

export default function MapLocationPreview({
  longitude,
  latitude,
}: {
  longitude: number | null;
  latitude: number | null;
}) {
  const t = useTranslations();

  if (!longitude || !latitude) return <div>{t("common.property.map.notSet")}</div>;

  const location: LatLngExpression = [latitude, longitude];

  return (
    <MapContainer center={location} zoom={13} className="h-full w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={t("common.property.map.attribution")}
      />
      <CircleMarker
        center={location}
        radius={8}
        fill
        pathOptions={{
          color: "#0069fe",
          fillColor: "#0069fe",
          fillOpacity: 1,
        }}
      ></CircleMarker>
    </MapContainer>
  );
}
