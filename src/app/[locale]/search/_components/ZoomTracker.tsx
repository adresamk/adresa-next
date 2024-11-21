import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function ZoomTracker({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => {
      onZoomChange(map.getZoom());
    };

    map.on("zoomend", handleZoom); // Update on zoom end

    return () => {
      //   map.off("zoomend", onZoomChange); // Cleanup on unmount
    };
  }, [map, onZoomChange]);

  return null;
}
