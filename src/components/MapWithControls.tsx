"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Municipality {
  name: string;
  coordinates: [number, number][]; // Array of coordinates for polygons
}

interface City {
  name: string;
  coordinates: [number, number]; // Single coordinate for markers
}
const skopjeCoordinates: [number, number] = [42.005, 21.422];
const northMacedoniaCoordinates: [number, number] = [41.56614, 21.698];
const municipalities: Municipality[] = [
  // Example data
  {
    name: "Municipality A",
    coordinates: [
      [42.5, 21.5],
      [42.6, 21.6],
    ],
  },
  {
    name: "Municipality B",
    coordinates: [
      [42.7, 21.7],
      [42.8, 21.8],
    ],
  },
];

const cities: City[] = [
  // Example data
  { name: "City A", coordinates: [42.5, 21.5] },
  { name: "City B", coordinates: [42.6, 21.6] },
];

export default function MapWithControls() {
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<Municipality | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div
        style={{
          position: "absolute",
          zIndex: 1000,
          background: "white",
          padding: "10px",
        }}
      >
        <select
          onChange={(e) =>
            setSelectedMunicipality(
              municipalities.find((m) => m.name === e.target.value) || null,
            )
          }
        >
          <option value="">Select Municipality</option>
          {municipalities.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          onChange={(e) =>
            setSelectedCity(
              cities.find((c) => c.name === e.target.value) || null,
            )
          }
        >
          <option value="">Select City/Village</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <MapContainer
        center={northMacedoniaCoordinates}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedMunicipality && (
          <Polygon positions={selectedMunicipality.coordinates} color="blue" />
        )}
        {selectedCity && (
          <Marker position={selectedCity.coordinates}>
            <Popup>{selectedCity.name}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
