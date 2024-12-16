import { CSSProperties, PropsWithChildren, ReactDOM } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { Listing, LocationPrecision } from "@prisma/client";
import ExactPin from "./icons/ExactPinHard";
import CirclePin from "./icons/CirclePin";
import CirclePinDiv from "./icons/CirclePinDiv";
import ExactPinHard from "./icons/ExactPinHard";
import ExactPinSoft from "./icons/ExactPinSoft";
import Area from "./icons/Area";
import { cn, displayPrice } from "@/lib/utils";
type AreaMultiplier = 0 | 2 | 3 | 5 | 7;
type AreaMultiplierFull = 0 | 2 | 3 | 5 | 7 | 4 | 6 | 10 | 14 | 9 | 15 | 21;
function zoomToMultiplier(
  zoom: number | undefined,
  doubleMultiplier: 1 | 2 | 3,
): AreaMultiplierFull {
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
  const pins = {
    featuredPin: divIcon({
      html: renderToStaticMarkup(
        <div
          className={`icon-combo zoom-${zoom && zoom >= 16 ? "deep" : ""} area-${
            type === "exact"
              ? 0
              : zoomToMultiplier(zoom, type === "approximate" ? 1 : 2)
          }`}
        >
          <div
            style={{ zIndex: 5000 + listingIdx }}
            className={`left-1/2 w-fit -translate-x-1/2 text-nowrap rounded-3xl border border-white bg-orange-400 px-1.5 py-1 font-medium text-black outline-black`}
          >
            {displayPrice(listing?.price ?? 0)}
          </div>
        </div>,
      ),
      className: "featured-pin",
      iconSize: [32, 45],
      iconAnchor: [13, 12],
    }),
    priceBox: divIcon({
      html: renderToStaticMarkup(
        <div
          className={`icon-combo zoom-${zoom && zoom >= 16 ? "deep" : ""} area-${
            type === "exact"
              ? 0
              : zoomToMultiplier(zoom, type === "approximate" ? 1 : 2)
          }`}
        >
          <div className="left-1/2 w-fit -translate-x-1/2 text-nowrap rounded-3xl border border-white bg-brand-light-blue px-1.5 py-1 font-medium text-white outline-black">
            {displayPrice(listing?.price ?? 0)}
          </div>
        </div>,
      ),
      className: "my-exact-pin-soft-icon",
      iconSize: [32, 45],
      iconAnchor: [13, 12],
    }),
    circle: divIcon({
      html: renderToStaticMarkup(
        <div
          className={`icon-combo zoom-${zoom && zoom >= 16 ? "deep" : ""} area-${
            type === "exact"
              ? 0
              : zoomToMultiplier(zoom, type === "approximate" ? 1 : 2)
          }`}
        >
          <CirclePinDiv />
        </div>,
      ),
      className: "my-exact-pin-soft-icon",
      iconSize: [32, 45],
      iconAnchor: [13, 12],
    }),
    wideCircle: divIcon({
      html: renderToStaticMarkup(
        <div
          className={`icon-combo zoom-${zoom && zoom >= 16 ? "deep" : ""} area-${
            type === "exact"
              ? 0
              : zoomToMultiplier(zoom, type === "approximate" ? 1 : 2)
          }`}
        >
          <CirclePinDiv />
        </div>,
      ),
      className: "my-circle-icon",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    }),
    exactPinHard: divIcon({
      html: renderToStaticMarkup(
        <div
          className={`icon-combo zoom-${zoom && zoom >= 16 ? "deep" : ""} area-${
            type === "exact"
              ? 0
              : zoomToMultiplier(zoom, type === "approximate" ? 1 : 2)
          }`}
        >
          <ExactPinHard />
        </div>,
      ),
      className: "my-exact-pin-hard-icon",
      iconSize: [32, 45],
      iconAnchor: [13, 12],
    }),
    exactPinSoft: divIcon({
      html: renderToStaticMarkup(
        <div
          className={`icon-combo zoom-${zoom && zoom >= 16 ? "deep" : ""} area-${
            type === "exact"
              ? 0
              : zoomToMultiplier(zoom, type === "approximate" ? 1 : 2)
          }`}
        >
          <ExactPinSoft />
        </div>,
      ),
      className: "my-exact-pin-soft-icon",
      iconSize: [32, 45],
      iconAnchor: [13, 12],
    }),
  };

  if (map === "SL") {
    if (type === "exact") {
      return pins.exactPinHard;
    } else if (type === "approximate") {
      return pins.exactPinSoft;
    } else if (type === "wide") {
      return pins.wideCircle;
    }
  }
  if (map === "S" && zoom) {
    if (isFeatured) {
      return pins.featuredPin;
    }
    if (zoom >= 16) {
      return pins.priceBox;
    }
    if (zoom <= 13) {
      return pins.circle;
    }
    if (zoom >= 14 && zoom <= 15) {
      if (type === "exact") {
        return pins.exactPinSoft;
      } else if (type === "approximate") {
        return pins.circle;
      } else if (type === "wide") {
        return pins.wideCircle;
      }
    }
  }
  if (map === "EL") {
    return pins.exactPinHard;
  }
};

function getListingIcon(listing: Listing, zoom: number) {
  let htmlMarkup = null;
  if (listing.locationPrecision === "exact") {
    htmlMarkup = (
      <div className="relative left-1/2 w-fit -translate-x-1/2 text-nowrap rounded-3xl border border-white bg-brand-light-blue px-1.5 py-1 font-medium text-white outline-black">
        {displayPrice(listing.price)}
      </div>
    );
  }

  if (listing.locationPrecision === "approximate") {
    htmlMarkup = (
      <div
        className={cn(
          "group relative -left-2 -top-2 h-4 w-4 rounded-full border border-white bg-brand-light-blue text-transparent",
          zoom === 16 && "hover:shadow-blue-glow",
          zoom === 17 && "hover:shadow-blue-glow-bigger",
          zoom >= 18 && "hover:shadow-blue-glow-biggest",
        )}
      ></div>
    );
  }

  if (listing.locationPrecision === "wide") {
    htmlMarkup = (
      <div className="relative -left-[3px] -top-[8px]">
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="18px"
          height="18px"
          viewBox="0 0 512.000000 512.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill="#0069fe"
            stroke="red"
            strokeWidth={2}
          >
            <path
              d="M2385 5114 c-670 -70 -1186 -403 -1440 -929 -115 -237 -185 -557
-185 -844 0 -446 336 -1197 983 -2196 277 -429 785 -1135 816 -1135 10 0 333
443 533 730 843 1212 1268 2083 1268 2598 0 286 -72 616 -184 847 -238 487
-697 810 -1296 910 -91 15 -412 28 -495 19z"
            />
          </g>
        </svg>
      </div>
    );
  }
  return divIcon({
    html: renderToStaticMarkup(htmlMarkup!),
  });
}
