"use client";
import L, {
  LatLng,
  LatLngExpression,
  Map,
  Marker as MarkerType,
} from "leaflet";
import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { randomSkopjeCoordinates } from "@/global/dataa";
import { cn } from "@/lib/utils";
import { PopulatedPlace } from "@/lib/data/macedonia/macedoniaPopulatedPlaces";
import { getPlaceCoordinates } from "@/lib/data/macedonia/importantData";
interface Location {
  lat: number;
  lng: number;
}
interface MapConfirmLocationProps {
  pinLocation: Location | null;
  setPinLocation: (location: Location) => void;
  populatedPlace: PopulatedPlace | null;
  municipality: PopulatedPlace | null;
}

function roundToNearest5(num: number) {
  // Multiply by 100000 to work with the 5th decimal place
  const scaled = num * 100000;
  // Round to nearest 5
  const rounded = Math.round(scaled / 5) * 5;
  // Convert back to original scale
  return rounded / 100000;
}
function snapToBoundary(
  point: LatLng,
  polygonCoordinates: LatLngExpression[][][],
): LatLng {
  // Convert the first array of coordinates to LatLng objects
  const polygonPoints = polygonCoordinates[0][0].map((coord) => {
    if (Array.isArray(coord)) {
      return L.latLng(coord[0], coord[1]);
    }
    return L.latLng(coord);
  });

  let closestPoint = polygonPoints[0];
  let minDistance = point.distanceTo(polygonPoints[0]);

  for (let i = 1; i < polygonPoints.length; i++) {
    const distance = point.distanceTo(polygonPoints[i]);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = polygonPoints[i];
    }
  }

  return closestPoint;
}
function isPointWithinPolygon(
  point: LatLng,
  polygonCoordinates: LatLngExpression[][][],
): boolean {
  // Create a Leaflet polygon from the coordinates
  const poly = L.polygon(polygonCoordinates[0]);
  const polyPoints = poly.getLatLngs()[0] as LatLng[];

  const x = point.lat;
  const y = point.lng;

  // console.log("Checking point:", { lat: x, lng: y });
  // console.log("First polygon point:", polyPoints[0]);
  // console.log("Number of polygon points:", polyPoints.length);
  // console.log("Sample of polygon points:", polyPoints.slice(0, 3));

  let inside = false;
  for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    const xi = polyPoints[i].lat;
    const yi = polyPoints[i].lng;
    const xj = polyPoints[j].lat;
    const yj = polyPoints[j].lng;

    const intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) {
      // console.log("Intersection found at points:", {
      //   point1: { lat: xi, lng: yi },
      //   point2: { lat: xj, lng: yj },
      // });
      inside = !inside;
    }
  }

  // console.log("Result:", inside);
  return inside;
}

function getActivePolygon(
  populatedPlaceCoords: LatLngExpression[][][] | null,
  municipalityCoords: LatLngExpression[][][] | null,
): LatLngExpression[][][] | null {
  return populatedPlaceCoords || municipalityCoords || null;
}

function handleMarkerPosition(
  marker: MarkerType,
  polygonCoords: LatLngExpression[][][],
  setPosition: (pos: LatLng) => void,
  setPinLocation: (pos: LatLng) => void,
) {
  const markerPosition = marker.getLatLng();

  if (isPointWithinPolygon(markerPosition, polygonCoords)) {
    const snappedPosition = {
      lat: roundToNearest5(markerPosition.lat),
      lng: roundToNearest5(markerPosition.lng),
    };
    const newPos = L.latLng(snappedPosition.lat, snappedPosition.lng);
    setPosition(newPos);
    setPinLocation(newPos);
  } else {
    const snappedPosition = snapToBoundary(markerPosition, polygonCoords);
    setPosition(snappedPosition);
    setPinLocation(snappedPosition);
  }
}

interface MapPosition {
  lat: number;
  lng: number;
}

interface MarkerHandlers {
  setPosition: (pos: LatLng) => void;
  setPinLocation: (pos: LatLng) => void;
}

interface PolygonBoundaries {
  populatedPlaceCoords: LatLngExpression[][][] | null;
  municipalityCoords: LatLngExpression[][][] | null;
}

const CONSTANTS = {
  DECIMAL_PRECISION: 100000,
  ROUNDING_STEP: 5,
  MAP_PADDING: [50, 50] as [number, number],
  DEFAULT_ZOOM: 7,
} as const;

function useMarkerPosition(initialLocation: MapPosition | null) {
  const [position, setPosition] = useState<LatLng | null>(() => {
    if (!initialLocation) return null;
    return L.latLng(
      roundToNearest5(initialLocation.lat),
      roundToNearest5(initialLocation.lng),
    );
  });

  const updatePosition = useCallback((newPos: MapPosition) => {
    setPosition(
      L.latLng(roundToNearest5(newPos.lat), roundToNearest5(newPos.lng)),
    );
  }, []);

  return { position, updatePosition };
}

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
      marker?.setLatLng(pinLocation);
    }
  }, [pinLocation?.lat, pinLocation?.lng]);

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
  }, [municipality, populatedPlace]);
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
    [municipalityCoordinates, populatedPlaceCoordinates, setPinLocation],
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
