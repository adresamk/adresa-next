import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";

interface MarkerClusterGroupProps {
  children: React.ReactElement | React.ReactElement[];
  options?: L.MarkerClusterGroupOptions;
}

const MarkerClusterGroup = ({ children, options }: MarkerClusterGroupProps) => {
  const map = useMap();

  useEffect(() => {
    // Create a MarkerClusterGroup instance
    const markerClusterGroup = L.markerClusterGroup(options);

    // Add markers to the cluster group
    const markers = React.Children.map(children, (child) => {
      if (child.props.position) {
        const marker = L.marker(child.props.position, {
          icon: child.props.icon, // Pass custom icon if provided
        });
        if (child.props.popupContent) {
          marker.bindPopup(child.props.popupContent);
        }
        return marker;
      }
      return null;
    }).filter(Boolean);

    markerClusterGroup.addLayers(markers);
    map.addLayer(markerClusterGroup);

    // Clean up on unmount
    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, children, options]);

  return null; // This component only manages side effects, so no UI is rendered
};

export default MarkerClusterGroup;
