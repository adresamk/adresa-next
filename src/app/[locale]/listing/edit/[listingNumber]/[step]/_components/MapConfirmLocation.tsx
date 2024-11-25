"use client";

import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Polygon, TileLayer } from "react-leaflet";
import { MapPosition, isPointWithinPolygon } from "./mapHelpers";
import { PopulatedPlace } from "@/lib/data/macedonia/macedoniaPopulatedPlaces";
import { getPlaceCoordinates } from "@/lib/data/macedonia/importantData";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-geometryutil";
import "./map.css";

interface MapConfirmLocationProps {
  municipality: PopulatedPlace | null;
  populatedPlace: PopulatedPlace | null;
  pinCoordinates: MapPosition | null;
  setPinCoordinates: (coordinates: MapPosition) => void;
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapConfirmLocation({
  municipality,
  populatedPlace,
  pinCoordinates,
  setPinCoordinates,
}: MapConfirmLocationProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isPinOutside, setIsPinOutside] = useState(false);

  const municipalityCoordinates: LatLngExpression[][][] | null = municipality
    ? getPlaceCoordinates(Number(municipality.jsonId))
    : null;

  const populatedPlaceCoordinates: LatLngExpression[][][] | null =
    populatedPlace ? getPlaceCoordinates(Number(populatedPlace.jsonId)) : null;

  // The active polygon that we check against (prioritize populated place)
  const activePolygon = populatedPlaceCoordinates || municipalityCoordinates;

  // Check if point is within polygon
  const checkPinLocation = (lat: number, lng: number) => {
    if (!activePolygon) return;
    const point = L.latLng(lat, lng);
    const isInside = isPointWithinPolygon(point, activePolygon);
    setIsPinOutside(!isInside);
  };

  // Event handlers for marker drag
  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const position = marker.getLatLng();
        const newCoords = {
          lat: parseFloat(position.lat.toFixed(6)),
          lng: parseFloat(position.lng.toFixed(6)),
        };
        setPinCoordinates(newCoords);
        checkPinLocation(newCoords.lat, newCoords.lng);
      }
    },
  };

  // Center map on polygon when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !populatedPlaceCoordinates) return;

    const polygon = L.polygon(populatedPlaceCoordinates);
    map.fitBounds(polygon.getBounds());
  }, [populatedPlaceCoordinates]);

  // Animate map to pin position when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !pinCoordinates) return;

    // Check if pin is visible in the current view
    const bounds = map.getBounds();
    const pinLatLng = L.latLng(pinCoordinates.lat, pinCoordinates.lng);

    if (!bounds.contains(pinLatLng)) {
      map.setView(pinLatLng, map.getZoom(), {
        animate: true,
        duration: 1,
      });
    }

    // Check if pin is within polygon boundaries
    checkPinLocation(pinCoordinates.lat, pinCoordinates.lng);
  }, [pinCoordinates, activePolygon]);

  if (!pinCoordinates) return null;

  return (
    <div className="space-y-2">
      {/* <div>

      {activePolygon}
      </div>
      <div>

      {municipalityCoordinates}
      </div>
      <div>

      {populatedPlaceCoordinates}
      </div> */}
      {isPinOutside && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Location Warning
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  The selected location is outside the{" "}
                  {populatedPlace ? "city/village" : "municipality"} boundaries.
                  Please adjust the pin location.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        ref={mapRef}
        center={[pinCoordinates.lat, pinCoordinates.lng]}
        zoom={13}
        className="h-[250px] w-full rounded"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {municipalityCoordinates && (
          <Polygon
            positions={municipalityCoordinates}
            pathOptions={{
              color: "#374151",
              weight: 2,
              fillOpacity: 0.1,
            }}
          />
        )}

        {populatedPlaceCoordinates && (
          <Polygon
            positions={populatedPlaceCoordinates}
            pathOptions={{
              color: "#2563eb",
              weight: 2,
              fillOpacity: 0.1,
            }}
          />
        )}

        <Marker
          position={[pinCoordinates.lat, pinCoordinates.lng]}
          draggable
          ref={markerRef}
          eventHandlers={eventHandlers}
          icon={markerIcon}
        />
      </MapContainer>
    </div>
  );
}
