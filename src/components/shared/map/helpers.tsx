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
  hoveredId?: string,
  listing?: Listing,
) => {
  const pins = {
    wideCircle: divIcon({
      html: renderToStaticMarkup(
        <div className="icon-combo">
          <Area multiplier={zoomToMultiplier(zoom, 2)} />
          <CirclePinDiv />
        </div>,
      ),
      className: "my-circle-icon",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    }),
    exactPinHard: divIcon({
      html: renderToStaticMarkup(<ExactPinHard />),
      className: "my-exact-pin-hard-icon",
      iconSize: [32, 45],
      iconAnchor: [13, 12],
    }),
    exactPinSoft: divIcon({
      html: renderToStaticMarkup(
        <div className="icon-combo">
          <Area multiplier={zoomToMultiplier(zoom, 1)} />
          <ExactPinSoft />
        </div>,
      ),
      className: "my-exact-pin-soft-icon",
      iconSize: [32, 45],
      iconAnchor: [13, 12],
    }),
  };

  if (map === "SL") {
    return pins.wideCircle;

    if (type === "exact") {
      return pins.exactPinHard;
    } else if (type === "approximate") {
      return pins.exactPinSoft;
    } else if (type === "wide") {
      return pins.wideCircle;
    }
  }

  if (type === "exact") {
    return pins.exactPinSoft;
  } else {
    return pins.wideCircle;
  }
};
