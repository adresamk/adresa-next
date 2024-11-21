import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { createLayerHook } from "@react-leaflet/core";
import L from "leaflet";
import "leaflet.markercluster";
import { createRoot, Root } from "react-dom/client";
import { useLeafletContext } from "@react-leaflet/core";

interface MarkerClusterGroupProps extends L.LayerOptions {
  children: React.ReactElement | React.ReactElement[];
  options?: L.MarkerClusterGroupOptions;
}

// Create a wrapper component for the popup content
const PopupContent = ({ children }: { children: React.ReactNode }) => {
  const [container] = useState(() => document.createElement("div"));

  useEffect(() => {
    const root = createRoot(container);
    root.render(children);
    return () => {
      setTimeout(() => {
        root.unmount();
      }, 0);
    };
  }, [children, container]);

  return null;
};
const MarkerClusterGroup = createLayerHook<
  L.MarkerClusterGroup,
  MarkerClusterGroupProps
>(({ children, options }, context) => {
  const markerClusterGroup = L.markerClusterGroup(options);
  const { instance } = { instance: markerClusterGroup };
  return { current: { instance, context } };
});

export default MarkerClusterGroup;
