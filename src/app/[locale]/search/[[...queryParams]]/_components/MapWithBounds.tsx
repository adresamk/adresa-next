import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useQueryStates } from "nuqs";
import { mapRelatedFiltersParsers } from "@/app/[locale]/searchParams";
import { readFromLocalStorage, writeToLocalStorage } from "@/lib/utils";
import { LatLngBoundsExpression } from "leaflet";

export default function MapWithBounds({
  mapBounds,
  listingsCount,
  searchOnMove,
  handleMapMove,
  mapSearchedCounter,
}: {
  mapBounds: LatLngBoundsExpression | undefined;
  listingsCount: number;
  searchOnMove: boolean;
  handleMapMove: (
    target: "resultsFilters" | "mapFilters" | "both",
    coordinates: string,
  ) => void;
  mapSearchedCounter: number;
}) {
  const map = useMap();

  let [boundingBoxCoordinates, setBoundingBoxCoordinates] = useQueryStates(
    mapRelatedFiltersParsers,
    {
      shallow: false,
      history: "replace",
    },
  );
  const { NELat, NELng, SWLat, SWLng, zoom } = boundingBoxCoordinates;

  console.log("bbc", boundingBoxCoordinates);

  useEffect(() => {}, [listingsCount]);

  useEffect(() => {
    const bounds = map && map.getBounds();
    console.log(bounds);
    const zoom = map.getZoom();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    const bbox = {
      SWLat: southWest.lat,
      SWLng: southWest.lng,
      NELat: northEast.lat,
      NELng: northEast.lng,
      zoom,
    };
    handleMapMove("both", JSON.stringify(bbox));
    if (mapSearchedCounter > 0) {
      setBoundingBoxCoordinates(bbox);
    }
  }, [mapSearchedCounter]);
  useEffect(() => {
    const handleBoundsChange = () => {
      //   console.log("searchOnMove", searchOnMove);
      // Function to get the bounds and send them to your API
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();
      const bbox = {
        SWLat: southWest.lat,
        SWLng: southWest.lng,
        NELat: northEast.lat,
        NELng: northEast.lng,
        zoom,
      };
      handleMapMove("mapFilters", JSON.stringify(bbox));
      //   console.log("Bounding Box:", bbox);
      if (searchOnMove) {
        handleMapMove("resultsFilters", JSON.stringify(bbox));
        setBoundingBoxCoordinates(bbox);
      }
    };
    // Get the initial bounds when the component mounts
    handleBoundsChange();
    // Set up event listener for map movement (when the user pans or zooms)
    map.on("moveend", handleBoundsChange);
    // Clean up the event listener on component unmount
    return () => {
      map.off("moveend", handleBoundsChange);
    };
  }, [map, searchOnMove, JSON.stringify(boundingBoxCoordinates)]);

  return null;
}
