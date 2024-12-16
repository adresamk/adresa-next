import { CSSProperties, PropsWithChildren, ReactDOM } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { LocationPrecision } from "@prisma/client";
import ExactPin from "./icons/ExactPin";
import CirclePin from "./icons/CirclePin";

export const getMapPinIcon = (
  type: LocationPrecision,
  onOff: boolean = false,
  props?: PropsWithChildren<any>,
) => {
  let pin;

  if (type === "exact") {
    if (onOff) {
      return divIcon({
        html: renderToStaticMarkup(<CirclePin {...props} />),
        className: "my-marker-icon",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
    } else {
      return divIcon({
        html: renderToStaticMarkup(<ExactPin {...props} />),
        className: "my-marker-icon",
        iconSize: [32, 45],
        iconAnchor: [18, 37],
        popupAnchor: [0, -35],
      });
    }
  } else if (type === "approximate") {
    // pin = <ApproximatePin {...myStyle}/>;
  } else if (type === "wide") {
    // pin = <WidePin {...myStyle}/>;
  }

  return divIcon({
    html: renderToStaticMarkup(pin),
    className: "my-marker-icon",
    iconSize: [32, 45],
    iconAnchor: [18, 37],
  });
};
