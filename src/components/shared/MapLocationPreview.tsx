"use client";
import { LatLngExpression } from "leaflet";
import { Listing } from "@prisma/client";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import { useTranslations } from "next-intl";
import { exactPinIcon } from "./map/MapIcons";
import { getMapPinIcon } from "./map/helpers";
import ZoomTracker from "@/app/[locale]/search/[[...queryParams]]/_components/ZoomTracker";

export default function MapLocationPreview({
  listing,
  pinPopupText,
}: {
  listing: Listing;
  pinPopupText: string;
}) {
  const t = useTranslations();
  const { latitude, longitude, locationPrecision } = listing;
  const [zoom, setZoom] = useState(11);
  if (!longitude || !latitude) return <div>{t("map.notSet")}</div>;

  const location: LatLngExpression = [latitude, longitude];
  return (
    <div>
      <div className="mb-10 h-[276px] overflow-hidden border">
        <MapContainer center={location} zoom={zoom} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={t("map.attribution")}
          />
          <ZoomTracker onZoomChange={setZoom} />
          <Marker
            icon={getMapPinIcon("SL", locationPrecision, zoom)}
            position={location}
          >
            {pinPopupText && (
              <Popup>
                <p>{pinPopupText}</p>
              </Popup>
            )}
          </Marker>
          {/* <Circle center={location} radius={5} pathOptions={{ color: "red" }} /> */}
        </MapContainer>
      </div>
    </div>
  );
}
