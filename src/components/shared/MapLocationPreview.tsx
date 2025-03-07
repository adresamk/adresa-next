"use client";
import { LatLngExpression } from "leaflet";
import { Listing, LocationPrecision } from "@prisma/client";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import { useTranslations } from "next-intl";
import { exactPinIcon } from "./map/MapIcons";
import { getMapPinIcon } from "./map/helpers";
import ZoomTracker from "@/app/[locale]/search/[[...queryParams]]/_components/ZoomTracker";
import { Button } from "@/components/ui/button";

function RefocusControl({ center }: { center: LatLngExpression }) {
  const t = useTranslations();
  const map = useMap();

  return (
    <div className="absolute left-2 top-2 z-[1000]">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => map.flyTo(center, 11, { duration: 1.5 })}
      >
        {t("map.refocus")}
      </Button>
    </div>
  );
}

export default function MapLocationPreview({
  coordinates,
  locationPrecision,
  pinPopupText,
}: {
  coordinates: {
    latitude: number | null;
    longitude: number | null;
  };
  locationPrecision: LocationPrecision;
  pinPopupText: string;
}) {
  const t = useTranslations();
  const [zoom, setZoom] = useState(11);
  const { latitude, longitude } = coordinates;
  if (!longitude || !latitude) return <div>{t("map.notSet")}</div>;

  const location: LatLngExpression = [latitude, longitude];
  return (
    <div>
      <div className="relative mb-10 h-[276px] overflow-hidden border">
        <MapContainer center={location} zoom={zoom} className="h-full w-full">
          <RefocusControl center={location} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={t("map.attribution")}
          />
          <ZoomTracker onZoomChange={setZoom} />
          <Marker
            icon={getMapPinIcon({
              map: "SL",
              type: locationPrecision,
              zoom,
              listingIdx: 0,
            })}
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
