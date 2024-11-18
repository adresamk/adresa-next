"use client";
import { LatLngExpression } from "leaflet";
import { CircleMarker, MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

export default function MapLocationPreview({
  longitude,
  latitude,
}: {
  longitude: number | null;
  latitude: number | null;
}) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    console.log("loaded on client map");
    setIsClient(true); // Ensures this runs only on the client
  }, []);
  if (!longitude || !latitude) return <div>Location is not set</div>;

  const location: LatLngExpression = [latitude, longitude];

  if (!isClient) {
    return (
      <div style={{ height: "400px", width: "100%", background: "#ccc" }}>
        Loading map...
      </div>
    );
  }
  return (
    <MapContainer center={location} zoom={13} className="h-full w-full">
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
      ></CircleMarker>
    </MapContainer>
  );
}
