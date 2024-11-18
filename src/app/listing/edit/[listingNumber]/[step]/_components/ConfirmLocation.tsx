"use client";

import { PopulatedPlace } from "@/lib/data/macedonia/macedoniaPopulatedPlaces";
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
  pinLocation: Location | null;
  setPinLocation: (location: Location) => void;
  populatedPlace: PopulatedPlace | null;
  municipality: PopulatedPlace | null;
}

export default function ConfirmLocation({
  pinLocation,
  setPinLocation,
  populatedPlace,
  municipality,
}: MapConfirmLocationProps) {
  return (
    <div>
      <MapConfirmLocation
        pinLocation={pinLocation}
        setPinLocation={setPinLocation}
        populatedPlace={populatedPlace}
        municipality={municipality}
      />
    </div>
  );
}
