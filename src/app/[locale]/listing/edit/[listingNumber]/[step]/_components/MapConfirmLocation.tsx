"use client";

import "leaflet-geometryutil";
import L, { LatLngExpression, Map, Marker as MarkerType } from "leaflet";
import { MapContainer, Marker, Polygon, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import { act, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getPlaceCoordinates } from "@/lib/data/macedonia/importantData";
// import isPointWithinPolygon from "point-in-polygon";
import {
  CONSTANTS,
  handleMarkerPosition,
  isPointWithinPolygon,
  MapConfirmLocationProps,
  MapPosition,
  roundToNearest5,
} from "./mapHelpers";
import { useMarkerPosition } from "./hooks";
import { randomSkopjeCoordinates } from "@/lib/data/macedonia/exampleData";

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
  const markerRef = useRef<MarkerType | null>(null);
  const mapRef = useRef<Map | null>(null);

  const municipalityCoordinates: LatLngExpression[][][] | null =
    getPlaceCoordinates(Number(municipality?.jsonId));
  const populatedPlaceCoordinates: LatLngExpression[][][] | null =
    getPlaceCoordinates(Number(populatedPlace?.jsonId));

  // The polygon that we check against pin position
  const activePolygon =
    populatedPlaceCoordinates || municipalityCoordinates || null;

  function positionPinForPlace() {
    const marker = markerRef.current;
    const map = mapRef.current;
    if (!marker || !map || !activePolygon) return;

    const polygon = L.polygon(activePolygon);
    const centerOfPolygon = polygon.getBounds().getCenter();
    marker.setLatLng(centerOfPolygon);

    const bounds = polygon.getBounds();
    map.fitBounds(bounds, { animate: true, padding: [50, 50] });
  }

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (!marker || !activePolygon) return;

        const newPosition = marker.getLatLng();
        if (!mapRef.current) return;
        mapUtils.validatePointInPolygon(
          mapRef.current,
          { lat: newPosition.lat, lng: newPosition.lng },
          activePolygon,
          setPinCoordinates,
          updatePosition,
        );
      },
    }),
    [activePolygon, setPinCoordinates, updatePosition],
  );

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

  // Modified useEffect to handle pin coordinates validation
  useEffect(() => {
    if (!activePolygon || !pinCoordinates || !mapRef.current) return;

    const point = L.latLng(pinCoordinates.lat, pinCoordinates.lng);

    // Only validate and update if the point is not already in the polygon
    if (!isPointWithinPolygon(point, activePolygon)) {
      mapUtils.validatePointInPolygon(
        mapRef.current,
        pinCoordinates,
        activePolygon,
        setPinCoordinates,
        updatePosition,
      );
    } else {
      // If point is already valid, just update position without triggering setPinCoordinates
      updatePosition(pinCoordinates);
    }
  }, [pinCoordinates, activePolygon, setPinCoordinates, updatePosition]);

  // Update marker when activePolygon changes
  // useEffect(() => {
  //   if (activePolygon) {
  //     positionPinForPlace();
  //   }
  // }, [activePolygon, positionPinForPlace]);

  return (
    <div
      className={cn(
        "relative h-[250px] overflow-hidden bg-white",
        isBigger && "fixed left-10 top-10 z-[3200] h-[70vh] w-[75vw] bg-white",
      )}
      role="region"
      aria-label="Interactive location map"
    >
      <button
        type="button"
        onClick={handleBS}
        className="absolute right-2 top-2 z-[3201] rounded bg-white px-2 py-1 shadow-md"
        aria-label={isBigger ? "Reduce map size" : "Expand map size"}
      >
        {isBigger ? "Reduce" : "Expand"}
      </button>
      <MapContainer
        center={randomSkopjeCoordinates[0]}
        zoom={CONSTANTS.DEFAULT_ZOOM}
        ref={mapRef}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {municipalityCoordinates && (
          <Polygon
            pathOptions={{ color: "black" }}
            positions={municipalityCoordinates}
          />
        )}

        {populatedPlaceCoordinates && (
          <Polygon
            pathOptions={{ color: "red" }}
            positions={populatedPlaceCoordinates}
          />
        )}
        {position && activePolygon && (
          <Marker
            draggable
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
          ></Marker>
        )}
      </MapContainer>
    </div>
  );
}
