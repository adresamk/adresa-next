import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { Listing, LocationPrecision } from "@prisma/client";
import CirclePinDiv from "./icons/CirclePinDiv";
import ExactPinHard from "./icons/ExactPinHard";
import ExactPinSoft from "./icons/ExactPinSoft";
import { cn, displayPrice, displayPricePerSquare } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
type AreaMultiplier = 0 | 2 | 3 | 5 | 7;
type AreaMultiplierFull = 0 | 2 | 3 | 5 | 7 | 4 | 6 | 10 | 14 | 9 | 15 | 21;
function zoomToMultiplier(
  zoom: number | undefined,
  doubleMultiplier: 1 | 2 | 3,
): AreaMultiplierFull {
  // doubleMultiplier 1 = 50m, 2 = 200m, 3 = 500m

  if (!zoom) return 0;
  if (zoom < 14) return 0;
  let multiplier: AreaMultiplier = 0;
  if (zoom === 14) {
    multiplier = 2;
  } else if (zoom === 15) {
    multiplier = 2;
  } else if (zoom === 16) {
    multiplier = 3;
  } else if (zoom === 17) {
    multiplier = 5;
  } else if (zoom === 18) {
    multiplier = 7;
  }
  if (zoom === 14 && doubleMultiplier === 2) {
    return 3;
  }
  return (multiplier * doubleMultiplier) as AreaMultiplierFull;
}
// single listing , search ,edit listing
type MapOptions = "SL" | "S" | "EL";
export const getMapPinIcon = (
  map: MapOptions,
  type: LocationPrecision,
  zoom?: number,
  isFeatured?: boolean,
  isSelectedInSearch?: boolean,
  listing?: Listing,
  listingIdx: number = 1,
) => {
  const multiplier = type === "approximate" ? 1 : 2;
  const areaClass = `area-circle area-${type === "exact" ? 0 : zoomToMultiplier(zoom, multiplier)}`;
  const showCircleExact = zoom === 15 || zoom === 14;
  const exactClass = type;
  const listingIdClass = `l-${listing?.id}`;
  const vipClass = listing?.isPaidPromo ? "vip" : "";
  const selectedClass = isSelectedInSearch ? "search-selected" : "";
  const pins = {
    pBoxP: divIcon({
      html: renderToStaticMarkup(
        <div className={`icon-combo ${exactClass} ${vipClass}`}>
          <div className="flex w-fit items-center text-nowrap rounded-3xl border border-white bg-brand-light-blue px-1.5 py-0.5 font-medium text-white hover:py-[3px]">
            {displayPrice(listing?.price ?? 0)}

            {listing?.previousPrice &&
              listing?.previousPrice > (listing?.price ?? 0) && (
                <div className="flex items-center">
                  <ArrowDown
                    className="lowered-price ml-0.5 h-4 w-4 text-green-200"
                    stroke="currentColor"
                  />
                </div>
              )}
          </div>
        </div>,
      ),
      className: `marker-pin price-box-pin  area-base ${areaClass} ${selectedClass} ${listingIdClass} `,
      iconSize: [12, 12],
      // iconAnchor: [13, 12],
    }),
    circleP: divIcon({
      html: renderToStaticMarkup(
        <div className={`icon-combo ${showCircleExact ? exactClass : ""}`}>
          <CirclePinDiv />
        </div>,
      ),
      className: `marker-pin circle-pin area-base ${areaClass} ${selectedClass} ${listingIdClass}`,
      iconSize: [12, 12],
      // iconAnchor: [13, 12],
    }),
    slPin: divIcon({
      html: renderToStaticMarkup(
        <div className={`icon-combo ${exactClass} ${vipClass}`}>
          {type === "approximate" ? <ExactPinSoft /> : <ExactPinHard />}
        </div>,
      ),
      className: `marker-pin sl-pin area-base ${areaClass} ${listingIdClass}`,
      iconSize: [12, 12],
      // iconAnchor: [13, 12],
    }),
    elPin: divIcon({
      html: renderToStaticMarkup(<ExactPinHard />),
      className: `marker-pin el-pin area-base ${areaClass} ${listingIdClass}`,
      // iconSize: [32, 45],
      // iconAnchor: [13, 12],
    }),
  };

  if (map === "SL") {
    return pins.slPin;
  }
  if (map === "S" && zoom) {
    if (isFeatured) {
      return pins.pBoxP;
    }
    return isFeatured || zoom >= 16 ? pins.pBoxP : pins.circleP;
  }
  if (map === "EL") {
    return pins.elPin;
  }
};
export function findRadiusInMeters(zoom: number, meters: number): number {
  // Convert meters to kilometers
  const km = meters / 1000;

  // Get base coordinates for Skopje
  const coords = { latitude: 41.9981, longitude: 21.4254 };

  // Calculate radius using cosine formula adjusted for latitude
  const radius = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));

  // Scale radius based on zoom level
  const zoomScale = Math.pow(2, 20 - zoom);

  return radius * zoomScale * 111320; // Convert back to meters
}

export function metersToPixels(
  radiusInMeters: number,
  latitude: number,
  zoomLevel: number,
) {
  const EARTH_CIRCUMFERENCE = 40075016.686; // in meters
  const TILE_SIZE = 502; // in pixels

  // Convert latitude from degrees to radians
  const latitudeInRadians = latitude * (Math.PI / 180);

  // Calculate meters per pixel (MPP)
  const metersPerPixel =
    (EARTH_CIRCUMFERENCE * Math.cos(latitudeInRadians)) /
    (TILE_SIZE * Math.pow(2, zoomLevel));

  // Calculate radius in pixels
  const radiusInPixels = radiusInMeters / metersPerPixel;

  return radiusInPixels;
}
export function getRadiusInPixels(
  latitude: number,
  zoom: number,
  radiusInMeters: number,
) {
  const earthRadius = 6378137; // Earth's radius in meters
  const scale = 256 * Math.pow(2, zoom); // Scale at this zoom level

  // Meters per pixel
  const metersPerPixel =
    (Math.cos((latitude * Math.PI) / 180) * 2 * Math.PI * earthRadius) / scale;

  // Radius in pixels
  const radiusInPixels = radiusInMeters / metersPerPixel;

  return radiusInPixels;
}

export function findCoordInRange(center: L.LatLng, radiusInMeters: number) {
  const lat = center.lat;
  const lng = center.lng;
  const radiusInDegrees = radiusInMeters / 111320;
  const randomLat = lat + (Math.random() - 0.5) * radiusInDegrees;
  const randomLng = lng + (Math.random() - 0.5) * radiusInDegrees;
  return { lat: randomLat, lng: randomLng };
}

export function calculateDiameter(zoomLevel: number, radiusInMeters: number) {
  const baseRadius = 50; // Base radius for which the values were derived
  const a = 0.00131; // Scaling factor for 50 meters
  const b = 1.955; // Growth rate per zoom level

  // Adjust the scaling factor based on the input radius
  const scalingFactor = radiusInMeters / baseRadius;

  // Calculate the diameter
  return scalingFactor * (a * Math.pow(b, zoomLevel));
}
