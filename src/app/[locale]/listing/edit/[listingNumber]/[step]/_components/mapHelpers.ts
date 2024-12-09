import { PopulatedPlace } from "@/lib/data/macedoniaOld/macedoniaPopulatedPlaces";
import L, { LatLng, LatLngExpression, Marker as MarkerType } from "leaflet";

export interface Location {
  lat: number;
  lng: number;
}
export interface MapConfirmLocationProps {
  pinCoordinates: Location | null;
  setPinCoordinates: (location: Location) => void;
  populatedPlace: PopulatedPlace | null;
  municipality: PopulatedPlace | null;
}

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MarkerHandlers {
  setPosition: (pos: LatLng) => void;
  setPinCoordinates: (pos: LatLng) => void;
}

export interface PolygonBoundaries {
  populatedPlaceCoords: LatLngExpression[][][] | null;
  municipalityCoords: LatLngExpression[][][] | null;
}

export const CONSTANTS = {
  DECIMAL_PRECISION: 100000,
  ROUNDING_STEP: 5,
  MAP_PADDING: [50, 50] as [number, number],
  DEFAULT_ZOOM: 7,
} as const;
export function roundToNearest5(num: number) {
  // Multiply by 100000 to work with the 5th decimal place
  const scaled = num * 100000;
  // Round to nearest 5
  const rounded = Math.round(scaled / 5) * 5;
  // Convert back to original scale
  return rounded / 100000;
}

export function roundToNearest6(num: number) {
  // Multiply by 1000000 to work with the 5th decimal place
  const scaled = num * 1000000;
  // Round to nearest 6
  const rounded = Math.round(scaled / 6) * 6;
  // Convert back to original scale
  return rounded / 1000000;
}
export function snapToBoundary(
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
export function isPointWithinPolygon(
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

export function handleMarkerPosition(
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
    console.log("newPos", newPos);
    setPosition(newPos);
    setPinLocation(newPos);
  } else {
    const snappedPosition = snapToBoundary(markerPosition, polygonCoords);
    setPosition(snappedPosition);
    setPinLocation(snappedPosition);
  }
}
