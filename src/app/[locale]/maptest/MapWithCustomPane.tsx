"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { skopjeCoordinates } from "@/lib/data/macedonia/importantData";

const CustomPane = () => {
  const map = useMap();

  useEffect(() => {
    console.log("Creating custom pane");
    const pane = map.createPane("customPane");
    console.log("Custom pane created:", pane);

    // Set the z-index and style for the custom pane
    // pane.style.zIndex = 650 + ""; // Renders above markers but below popups
    pane.style.pointerEvents = "none"; // Optional: prevent interaction

    // Add custom content to the pane using Circle component
    L.circle(skopjeCoordinates, {
      radius: 500,
      pane: "customPane",
      color: "red",
    }).addTo(map);

    return () => {
      // Clean up if necessary
      map.getPane("customPane")?.remove();
    };
  }, [map]);

  return null;
};

export default function MapWithCustomPane() {
  return (
    <MapContainer
      center={skopjeCoordinates}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <CustomPane />
    </MapContainer>
  );
}
