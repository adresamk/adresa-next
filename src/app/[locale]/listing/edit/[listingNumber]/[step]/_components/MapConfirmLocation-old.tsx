"use client";

import "leaflet-geometryutil";
import L, {
  LatLng,
  LatLngExpression,
  Map,
  Marker as MarkerType,
} from "leaflet";
import { MapContainer, Marker, Polygon, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "./map.css";
import { act, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CONSTANTS,
  MapConfirmLocationProps,
  MapPosition,
  handleMarkerPosition,
  // getPlaceCoordinates,
  isPointWithinPolygon,
  roundToNearest5,
  snapToBoundary,
} from "./mapHelpers";
import { getPlaceCoordinates } from "@/lib/data/macedoniaOld/importantData";
import { useMarkerPosition } from "./hooks";
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const mapUtils = {
  centerOnPolygon(map: Map, coordinates: LatLngExpression[][][]) {
    const polygon = L.polygon(coordinates);
    const bounds = polygon.getBounds();
    map.fitBounds(bounds, { animate: true, padding: CONSTANTS.MAP_PADDING });
    return polygon.getBounds().getCenter();
  },

  roundCoordinates(position: MapPosition): MapPosition {
    return {
      lat: roundToNearest5(position.lat),
      lng: roundToNearest5(position.lng),
    };
  },
  validatePointInPolygon(
    map: Map,
    position: MapPosition,
    polygon: LatLngExpression[][][],
    setPinCoordinates: (pos: MapPosition) => void,
    updatePosition: (pos: MapPosition) => void,
  ) {
    const marker = L.marker([position.lat, position.lng]);
    handleMarkerPosition(
      marker,
      polygon,
      (pos) => updatePosition({ lat: pos.lat, lng: pos.lng }),
      (pos) => setPinCoordinates({ lat: pos.lat, lng: pos.lng }),
    );
  },
};

export default function MapConfirmLocation({
  pinCoordinates,
  populatedPlace,
  municipality,
  setPinCoordinates,
}: MapConfirmLocationProps) {
  const { position, updatePosition } = useMarkerPosition(pinCoordinates);
  const [isBigger, setIsBigger] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPinOutside, setIsPinOutside] = useState(false);
  const markerRef = useRef<MarkerType | null>(null);
  const mapRef = useRef<Map | null>(null);

  const municipalityCoordinates: LatLngExpression[][][] | null =
    getPlaceCoordinates(Number(municipality?.jsonId));
  const populatedPlaceCoordinates: LatLngExpression[][][] | null =
    getPlaceCoordinates(Number(populatedPlace?.jsonId));

  // The polygon that we check against pin position - prioritize populated place
  const activePolygon =
    populatedPlaceCoordinates || municipalityCoordinates || null;
  const displayPolygon = municipalityCoordinates;

  // Function to round coordinates to 5 decimal places
  const roundCoordinates = (lat: number, lng: number): MapPosition => ({
    lat: parseFloat(lat.toFixed(5)),
    lng: parseFloat(lng.toFixed(5)),
  });

  // Function to handle coordinate validation and updates
  const validateAndUpdatePosition = useCallback(
    (newPosition: MapPosition, skipPinUpdate = false) => {
      if (!activePolygon) return;

      const point = L.latLng(newPosition.lat, newPosition.lng);
      const isInPolygon = isPointWithinPolygon(point, activePolygon);
      setIsPinOutside(!isInPolygon);

      if (!isInPolygon) {
        setIsAdjusting(true);
        const snappedPoint = snapToBoundary(point, activePolygon);
        const roundedCoords = roundCoordinates(
          snappedPoint.lat,
          snappedPoint.lng,
        );
        updatePosition(roundedCoords);
        if (!skipPinUpdate) {
          setPinCoordinates(roundedCoords);
        }
        setTimeout(() => setIsAdjusting(false), 1500);
      } else {
        const roundedCoords = roundCoordinates(point.lat, point.lng);
        updatePosition(roundedCoords);
        if (!skipPinUpdate) {
          setPinCoordinates(roundedCoords);
        }
      }
    },
    [activePolygon, updatePosition, setPinCoordinates],
  );

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (!marker) return;
        const newPosition = marker.getLatLng();
        validateAndUpdatePosition({
          lat: newPosition.lat,
          lng: newPosition.lng,
        });
      },
    }),
    [validateAndUpdatePosition],
  );

  // Effect to initialize the map and handle polygon changes
  useEffect(() => {
    if (!activePolygon || !mapRef.current) return;

    const map = mapRef.current;

    // Fit bounds to the active polygon (populated place or municipality)
    const activePolygonLayer = L.polygon(activePolygon);
    const bounds = activePolygonLayer.getBounds();
    map.fitBounds(bounds, { animate: true, padding: CONSTANTS.MAP_PADDING });

    // If we have pinCoordinates, validate them against the active polygon
    if (pinCoordinates && !isInitialized) {
      validateAndUpdatePosition(pinCoordinates, true);
      setIsInitialized(true);
    } else if (!pinCoordinates) {
      // If no coordinates, set to center of active polygon
      const center = bounds.getCenter();
      const roundedCoords = roundCoordinates(center.lat, center.lng);
      setPinCoordinates(roundedCoords);
      updatePosition(roundedCoords);
      setIsInitialized(true);
    }
  }, [
    activePolygon,
    pinCoordinates,
    isInitialized,
    validateAndUpdatePosition,
    setPinCoordinates,
  ]);

  // Function to handle the toggle of map size and adjust the map view accordingly
  function handleBS() {
    setIsBigger(!isBigger);

    // Add a small delay to ensure the container has resized
    setTimeout(() => {
      const map = mapRef.current;
      if (!map) return;

      // Invalidate size to handle container resize
      map.invalidateSize();

      // Recenter and adjust view
      if (activePolygon) {
        const polygon = L.polygon(activePolygon);
        const bounds = polygon.getBounds();
        map.fitBounds(bounds, {
          animate: true,
          padding: CONSTANTS.MAP_PADDING,
        });
      } else if (position) {
        map.setView(position, map.getZoom());
      }
    }, 100);
  }

  const defaultCenter: LatLngExpression = [42.0, 21.4]; // Default coordinates for Macedonia

  return (
    <div
      className={cn(
        "relative h-[250px] overflow-hidden bg-white",
        isBigger && "fixed left-10 top-10 z-[3200] h-[70vh] w-[75vw] bg-white",
      )}
      role="region"
      aria-label="Interactive location map"
    >
      <div className="absolute right-2 top-2 z-[3201] flex gap-2">
        {isPinOutside && (
          <button
            type="button"
            onClick={() => {
              if (!activePolygon || !mapRef.current) return;
              const polygon = L.polygon(activePolygon);
              const center = polygon.getBounds().getCenter();
              const roundedCoords = roundCoordinates(center.lat, center.lng);
              setPinCoordinates(roundedCoords);
            }}
            className="rounded bg-white px-2 py-1 text-sm shadow-md hover:bg-gray-50"
            aria-label="Center pin in selected area"
          >
            Reposition Pin
          </button>
        )}
        <button
          type="button"
          onClick={handleBS}
          className="rounded bg-white px-2 py-1 text-sm shadow-md hover:bg-gray-50"
          aria-label={isBigger ? "Reduce map size" : "Expand map size"}
        >
          {isBigger ? "Reduce" : "Expand"}
        </button>
      </div>
      <MapContainer
        center={position ?? defaultCenter}
        zoom={7}
        className={cn(
          "h-full w-full transition-all duration-300",
          isBigger ? "rounded-lg" : "rounded",
        )}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {displayPolygon && (
          <Polygon
            positions={displayPolygon}
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
        {position && (
          <Marker
            position={position}
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
