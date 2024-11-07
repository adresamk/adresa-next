"use client";
import { LatLngExpression, Marker as MarkerType } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { randomSkopjeCoordinates } from "@/global/dataa";
interface Location {
  lat: number;
  lng: number;
}
interface MapConfirmLocationProps {
  pinLocation: Location | null;
  setPinLocation: (location: Location) => void;
}
export default function MapConfirmLocation({
  pinLocation,
  setPinLocation,
}: MapConfirmLocationProps) {
  const [position, setPosition] = useState(pinLocation);
  const markerRef = useRef<MarkerType | null>(null);
  //update position when inputs chage
  useEffect(() => {
    if (pinLocation && pinLocation.lat && pinLocation.lng) {
      console.log(pinLocation);
      const marker = markerRef.current;
      marker?.setLatLng(pinLocation);
    }
  }, [pinLocation]);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          const fixedTo5 = {
            lat: parseFloat(lat.toFixed(5)),
            lng: parseFloat(lng.toFixed(5)),
          };
          setPosition(fixedTo5);
          setPinLocation(fixedTo5);
        }
      },
    }),
    [],
  );
  //   const toggleDraggable = useCallback(() => {
  //     setDraggable((d) => !d);
  //   }, []);
  return (
    <div className="h-[250px] overflow-hidden">
      <MapContainer
        center={randomSkopjeCoordinates[0]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {position && position.lat && position.lng && (
          <Marker
            draggable
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
          >
            {/* <Popup minWidth={90}> */}
            {/* <span onClick={toggleDraggable}>
              {draggable
                ? "Marker is draggable"
                : "Click here to make marker draggable"}
            </span> */}
            {/* </Popup> */}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
