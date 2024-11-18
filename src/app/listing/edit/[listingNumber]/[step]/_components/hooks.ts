import L, { LatLng } from "leaflet";
import { MapPosition, roundToNearest5 } from "./mapHelpers";
import { useCallback, useState } from "react";
export function useMarkerPosition(initialLocation: MapPosition | null) {
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
