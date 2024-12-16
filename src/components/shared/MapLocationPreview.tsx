"use client";
import { icon, LatLngExpression } from "leaflet";
import { Listing, LocationPrecision } from "@prisma/client";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import { useTranslations } from "next-intl";
import { Pin } from "lucide-react";
import { exactPinIcon } from "./map/MapIcons";
import { getMapPinIcon } from "./map/helpers";

export default function MapLocationPreview({
  listing,
  pinPopupText,
}: {
  listing: Listing;
  pinPopupText: string;
}) {
  const t = useTranslations();
  const { latitude, longitude, locationPrecision } = listing;

  if (!longitude || !latitude)
    return <div>{t("common.property.map.notSet")}</div>;

  const location: LatLngExpression = [latitude, longitude];

  console.log(exactPinIcon);
  return (
    <div>
      <div className="mb-10 h-[276px] overflow-hidden border">
        <MapContainer center={location} zoom={13} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={t("map.attribution")}
          />
          {/* {locationPrecision === "exact" && <Marker position={location}></Marker>} */}
          <Marker icon={getMapPinIcon(locationPrecision)} position={location}>
            {pinPopupText && (
              <Popup>
                <p>{pinPopupText}</p>
              </Popup>
            )}
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
