"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { populatedPlaces2, structuredMunicipalities } from "@/global/country";
import { populatedPlaces } from "@/global/dataa";

interface PopulatedPlace {
  id: string;
  name: string;
  centerPoint: [number, number];
  coordinates: [number, number][]; // Array of coordinates for polygons
}

const skopjeCoordinates: [number, number] = [42.005, 21.422];
const northMacedoniaCoordinates: [number, number] = [41.56614, 21.698];

export default function MapWithControls() {
  //   console.log(structuredMunicipalities);
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<PopulatedPlace | null>(null);
  const [selectedCity, setSelectedCity] = useState<PopulatedPlace | null>(null);
  const [cities, setCities] = useState<PopulatedPlace[]>(() => {
    return [];
  });
  const [municipalities, setMunicipalities] = useState<PopulatedPlace[]>(() => {
    console.log(structuredMunicipalities);
    const municipalitiesArray: PopulatedPlace[] = [];
    Object.keys(structuredMunicipalities).forEach((key) => {
      const place = populatedPlaces2.find((pp) => pp.id === key);
      if (!place) {
        console.log("my key ", key);
      }
      municipalitiesArray.push({
        id: key,
        name: place?.name || "Name",
        centerPoint: [42, 40],
        coordinates: [],
      });
    });
    return municipalitiesArray;
  });

  //effect description
  useEffect(() => {
    console.log(selectedMunicipality);
    if (selectedMunicipality) {
      setCities(() => {
        const citiesArray: PopulatedPlace[] = [];

        structuredMunicipalities[selectedMunicipality.id].forEach(
          (cityId: string) => {
            const city = populatedPlaces2.find((pp) => pp.id === cityId);
            if (city) {
              citiesArray.push({
                id: cityId,
                name: city.name || "Name",
                centerPoint: [42, 40],
                coordinates: [],
              });
            }
          },
        );
        return citiesArray;
      });
    }
  }, [selectedMunicipality]);

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
            <option key={m.id} value={m.name}>
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
            <option key={c.id} value={c.name}>
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
          <Marker position={selectedCity.centerPoint}>
            <Popup>{selectedCity.name}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
