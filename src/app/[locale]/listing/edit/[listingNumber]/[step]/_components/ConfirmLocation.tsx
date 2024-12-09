"use client";

import { PopulatedPlace } from "@/lib/data/macedoniaOld/macedoniaPopulatedPlaces";
import dynamic from "next/dynamic";

// Dynamically import the map component with no SSR
const MapConfirmLocation = dynamic(() => import("./MapConfirmLocation"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});
interface Location {
  lat: number;
  lng: number;
}
interface MapConfirmLocationProps {
  pinCoordinates: Location | null;
  setPinCoordinates: (location: Location) => void;
  populatedPlace: PopulatedPlace | null;
  municipality: PopulatedPlace | null;
}

export default function ConfirmLocation({
  pinCoordinates,
  setPinCoordinates,
  populatedPlace,
  municipality,
}: MapConfirmLocationProps) {
  return (
    <div>
      <MapConfirmLocation
        pinCoordinates={pinCoordinates}
        setPinCoordinates={setPinCoordinates}
        populatedPlace={populatedPlace}
        municipality={municipality}
      />
    </div>
  );
}
