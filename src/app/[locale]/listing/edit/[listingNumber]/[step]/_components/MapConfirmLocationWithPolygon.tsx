"use client";

import L, {
  LatLngExpression,
  LatLngBoundsExpression,
  LatLngTuple,
} from "leaflet";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMapEvent,
} from "react-leaflet";
import { MapPosition, isPointWithinPolygon } from "./mapHelpers";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCoordinates,
  getMunicipalityCoordinates,
} from "@/lib/data/macedonia/importantData";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "./map.css";
import { northMacedoniaCoordinates } from "@/lib/data/macedoniaOld/importantData";

interface MapConfirmLocationProps {
  municipality: string | null;
  place: string | null;
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
  municipality,
  place,
  pinLocation,
  setPinLocation,
}: MapConfirmLocationProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isPinOutside, setIsPinOutside] = useState(false);

  const municipalityCoordinates = municipality
    ? getMunicipalityCoordinates(municipality!)
    : null;

  const placeCoordinates = place ? getCoordinates([place]) : null;

  const placeFixed = placeCoordinates ? placeCoordinates[0][place!] : null;

  const municipalityFixed = municipalityCoordinates
    ? municipalityCoordinates.map((o) => {
        return Object.values(o)[0];
      })
    : null;

  console.log({
    municipalityCoordinates,
    placeCoordinates,
  });

  console.log({
    municipalityFixed,
    placeFixed,
  });

  // const municipalityPolygon: LatLngExpression[][][] =
  //   municipalityCoordinates
  //     ? Object.values(municipalityCoordinates).reduce(
  //         (acc, polygon) => {
  //           if (polygon && polygon.length > 0) {
  //             acc.push(...polygon);
  //           }
  //           return acc;
  //         },
  //         [] as LatLngExpression[][][],
  //       )
  //     : [];
  // window.mF = municipalityFixed;
  const municipalityPolygon: LatLngExpression[][][][] | null = municipalityFixed
    ? municipalityFixed.map((polygon) =>
        polygon.map((ring) =>
          ring.map((coord) => coord.map((c) => [c[1], c[0]])),
        ),
      )
    : null;
  const placePolygon: LatLngExpression[][][] | null = placeFixed
    ? placeFixed.map((polygon) =>
        polygon.map((ring) =>
          ring.map((coord) => [coord[1], coord[0]] as LatLngExpression),
        ),
      )
    : null;

  //effect description
  useEffect(() => {
    if (placePolygon && pinLocation) {
      const isWithin = isPointWithinPolygon(
        L.latLng(pinLocation.lat, pinLocation.lng),
        placePolygon,
      );
      setIsPinOutside(!isWithin);
    }
  }, [placePolygon, pinLocation]);

  // console.log("municipalityPolygon", municipalityPolygon);
  // let placePolygon: any = place ? getMunicipalityCoordinates([place]) : null;

  // console.log("placePolygon", placePolygon);
  // selectedMunicipality && places.length > 0
  //   ? Object.values(allPlacesFromSelectedMunicipalityPolygons).reduce(
  //       (acc, placePolygons) => {
  //         // Only add non-empty polygons
  //         if (placePolygons && placePolygons.length > 0) {
  //           acc.push(...placePolygons);
  //         }
  //         return acc;
  //       },
  //       [] as LatLngExpression[][][],
  //     )
  //   : [];
  // The active polygon that we check against (prioritize populated place)

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
        console.log("newCoords", newCoords);
        setPinLocation(newCoords);
        // checkPinLocation(newCoords.lat, newCoords.lng);
      }
    },
  };

  // Center map on polygon when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !placeCoordinates) return;

    // const polygon = L.polygon(placeCoordinates);
    // map.fitBounds(polygon.getBounds());
  }, [placeCoordinates]);

  // Animate map to pin position when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !pinLocation) return;

    // Check if pin is visible in the current view
    const bounds = map.getBounds();
    const pinLatLng = L.latLng(pinLocation.lat, pinLocation.lng);

    if (!bounds.contains(pinLatLng)) {
      map.setView(pinLatLng, map.getZoom(), {
        animate: true,
        duration: 1,
      });
    }

    // Check if pin is within polygon boundaries
    // checkPinLocation(pinLocation.lat, pinLocation.lng);
  }, [pinLocation]);

  // if (!pinLocation) return null;
  const pinCoords = pinLocation
    ? ([pinLocation.lat, pinLocation.lng] as LatLngExpression)
    : null;
  const mapCenter = pinCoords
    ? pinCoords
    : (northMacedoniaCoordinates as LatLngExpression);

  const municipalityPolygonBounds: LatLngBoundsExpression = useMemo(() => {
    if (!municipalityPolygon) {
      // Provide a default bounds, e.g., the whole country or a specific area
      return L.latLngBounds(
        northMacedoniaCoordinates as unknown as LatLngExpression[],
      );
    }

    const bounds = L.latLngBounds([]);
    municipalityPolygon.forEach((polygon) =>
      polygon.forEach((ring) =>
        ring.forEach((point) => {
          bounds.extend([point[0], point[1]] as unknown as LatLngTuple);
        }),
      ),
    );

    return bounds;
  }, [municipalityPolygon]);
  return (
    <div className="space-y-2">
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
                  {place ? "city/village" : "municipality"} boundaries. Please
                  adjust the pin location.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        ref={mapRef}
        // center={mapCenter}
        // zoom={pinCoords ? 13 : 7}
        bounds={municipalityPolygonBounds}
        boundsOptions={{ padding: [20, 20] }}
        className="h-[250px] w-full rounded"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler setPinLocation={setPinLocation} />
        {municipalityPolygon && (
          <Polygon
            // @ts-ignore
            positions={municipalityPolygon}
            color="red"
          />
        )}

        {placePolygon && <Polygon positions={placePolygon} color="yellow" />}

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
