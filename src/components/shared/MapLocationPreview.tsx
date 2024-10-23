"use client";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

export default function MapLocationPreview({
  longitude,
  latitude,
}: {
  longitude: number | null;
  latitude: number | null;
}) {
  if (!longitude || !latitude) return <div>Location is not set</div>;

  const location: LatLngExpression = [latitude, longitude];
  return (
    <MapContainer
      center={location}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CircleMarker
        center={location}
        radius={8}
        fill
        pathOptions={{
          color: "#0069fe",
          fillColor: "#0069fe",
          fillOpacity: 1,
        }}
      >
        <Popup>
          <div>Mario 123</div>
        </Popup>
      </CircleMarker>
    </MapContainer>
  );
}
