"use client";

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
  place: string | null;
  municipality: string | null;
}

export default function ConfirmLocation({
  pinLocation,
  setPinLocation,
  place,
  municipality,
}: MapConfirmLocationProps) {
  return (
    <div>
      <MapConfirmLocation
        pinLocation={pinLocation}
        setPinLocation={setPinLocation}
        place={place}
        municipality={municipality}
      />
    </div>
  );
}
