"use client";

import L, { LatLngExpression, LatLngBoundsExpression } from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvent } from "react-leaflet";
import { MapPosition } from "./mapHelpers";
import { useEffect, useMemo, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "./map.css";
import { northMacedoniaCoordinates } from "@/lib/data/macedoniaOld/importantData";
import { getMunicipalityCenterPoints } from "@/lib/data/macedonia/importantData";

interface MapConfirmLocationProps {
  municipality: string | null;
  pinLocation: MapPosition | null;
  setPinLocation: (location: MapPosition) => void;
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({
  setPinLocation,
}: {
  setPinLocation: (location: MapPosition) => void;
}) {
  const map = useMapEvent("click", (e: any) => {
    const { lat, lng } = e.latlng;
    setPinLocation({
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
    });
  });
  return null;
}

export default function MapConfirmLocation({
  pinLocation,
  setPinLocation,
  municipality,
}: MapConfirmLocationProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const municipalityCenterPoints = useMemo(
    () => getMunicipalityCenterPoints(municipality),
    [municipality],
  );
  const initialMunicipalityCenterPoints = useRef(municipalityCenterPoints);
  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const position = marker.getLatLng();
        const newCoords = {
          lat: parseFloat(position.lat.toFixed(6)),
          lng: parseFloat(position.lng.toFixed(6)),
        };
        setPinLocation(newCoords);
      }
    },
  };

  // Animate map to pin position when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !pinLocation) return;

    const bounds = map.getBounds();
    const pinLatLng = L.latLng(pinLocation.lat, pinLocation.lng);

    if (!bounds.contains(pinLatLng)) {
      map.setView(pinLatLng, map.getZoom(), {
        animate: true,
        duration: 1,
      });
    }
  }, [pinLocation]);

  const pinCoords = pinLocation
    ? ([pinLocation.lat, pinLocation.lng] as LatLngExpression)
    : null;

  const mapCenter =
    pinCoords ||
    (municipalityCenterPoints as LatLngExpression) ||
    northMacedoniaCoordinates;
  const mapZoom = pinCoords ? 15 : municipalityCenterPoints ? 13 : 7;

  console.log(mapCenter, mapZoom);
  useEffect(() => {
    if (
      municipalityCenterPoints &&
      municipalityCenterPoints?.toString() !==
        initialMunicipalityCenterPoints.current?.toString()
    ) {
      mapRef.current?.setView(municipalityCenterPoints as LatLngExpression, 13);
    } else {
      mapRef.current?.setView(mapCenter, mapZoom);
    }
  }, [mapCenter, mapZoom, municipalityCenterPoints]);
  return (
    <div className="space-y-2">
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={mapZoom}
        className="h-[250px] w-full rounded"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler setPinLocation={setPinLocation} />

        {pinCoords && (
          <Marker
            position={pinCoords}
            draggable
            ref={markerRef}
            eventHandlers={eventHandlers}
            icon={markerIcon}
          />
        )}
      </MapContainer>
    </div>
  );
}
