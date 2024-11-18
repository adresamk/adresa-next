"use client";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getPlaceCoordinates } from "@/lib/data/macedonia/importantData";
import {
  CONSTANTS,
  getActivePolygon,
  handleMarkerPosition,
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
};

export default function MapConfirmLocation({
  pinLocation,
  populatedPlace,
  municipality,
  setPinLocation,
}: MapConfirmLocationProps) {
  const { position, updatePosition } = useMarkerPosition(pinLocation);
  const [isBigger, setIsBigger] = useState(false);
  const markerRef = useRef<MarkerType | null>(null);
  const municipalityCoordinates: LatLngExpression[][][] | null =
    getPlaceCoordinates(Number(municipality?.jsonId));
  const populatedPlaceCoordinates: LatLngExpression[][][] | null =
    getPlaceCoordinates(Number(populatedPlace?.jsonId));

  const mapRef = useRef<Map | null>(null);

  // console.log("municipalityCoordinates");
  // console.log(municipalityCoordinates);
  // console.log("populatedPlaceCoordinates");
  // console.log(populatedPlaceCoordinates);
  //update position when inputs change
  useEffect(() => {
    if (pinLocation) {
      updatePosition(pinLocation);
    }
    if (pinLocation && pinLocation.lat && pinLocation.lng) {
      // console.log(pinLocation);
      const marker = markerRef.current;
      marker?.setLatLng({ lat: pinLocation.lat, lng: pinLocation.lng });
    }
  }, [pinLocation, updatePosition]);

  //update marker when they change municipality or populated place
  useEffect(() => {
    if (municipalityCoordinates) {
      const marker = markerRef.current;
      const map = mapRef.current;
      if (populatedPlaceCoordinates) {
        // find center of polygon
        const polygon = L.polygon(populatedPlaceCoordinates);
        const centerOfPolygon = polygon.getBounds().getCenter();
        marker?.setLatLng(centerOfPolygon);
        // fit map to polygon
        // const bounds = L.latLngBounds(populatedPlaceCoordinates[0][0]);
        const bounds = polygon.getBounds();
        map?.fitBounds(bounds, { animate: true, padding: [50, 50] });
        return;
      }
      const polygon = L.polygon(municipalityCoordinates);
      const centerOfPolygon = polygon.getBounds().getCenter();
      marker?.setLatLng(centerOfPolygon);
      // fit map to polygon
      const bounds = polygon.getBounds();
      map?.fitBounds(bounds, { animate: true, padding: [50, 50] });
    }
  }, [
    municipality,
    municipalityCoordinates,
    populatedPlace,
    populatedPlaceCoordinates,
  ]);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        const activePolygon = getActivePolygon(
          populatedPlaceCoordinates,
          municipalityCoordinates,
        );

        if (marker && activePolygon) {
          handleMarkerPosition(
            marker,
            activePolygon,
            updatePosition,
            setPinLocation,
          );
        }
      },
    }),
    [
      municipalityCoordinates,
      populatedPlaceCoordinates,
      setPinLocation,
      updatePosition,
    ],
  );
  //   const toggleDraggable = useCallback(() => {
  //     setDraggable((d) => !d);
  //   }, []);

  // console.log(kumanovoCoordinates);
  function handleBS() {
    setIsBigger(!isBigger);

    // Add a small delay to ensure the container has resized
    setTimeout(() => {
      const map = mapRef.current;
      if (!map) return;

      // Invalidate size to handle container resize
      map.invalidateSize();

      // Recenter and adjust view
      const activePolygon = getActivePolygon(
        populatedPlaceCoordinates,
        municipalityCoordinates,
      );

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
        {position && position.lat && position.lng && (
          <Marker
            draggable
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
          >
            {/* <Popup minWidth={90}> */}
            {/* <span onClick={toggleDraggable}>
              {draggable
                ? "Marker is draggable"
                : "Click here to make marker draggable"}
            </span> */}
            {/* </Popup> */}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
