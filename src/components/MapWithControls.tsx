// "use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import {
  getMunicipalityPlaces,
  getPlaceCoordinates,
  municipalitiesOptions,
} from "@/lib/data/macedoniaOld/importantData";
import { northMacedoniaCoordinates } from "@/lib/data/macedoniaOld/importantData";
import { PopulatedPlace } from "@/lib/data/macedoniaOld/macedoniaPopulatedPlaces";

export default function MapWithControls() {
  const [cities, setCities] = useState<PopulatedPlace[]>([]);
  // const [municipalities, setMunicipalities] = useState<PopulatedPlace[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<PopulatedPlace | null>(null);
  const [selectedCity, setSelectedCity] = useState<PopulatedPlace | null>(null);

  const [municipalityCoordinates, setMunicipalityCoordinates] = useState<
    LatLngExpression[][][] | null
  >(null);

  const [cityCoordinates, setCityCoordinates] = useState<
    LatLngExpression[][][] | null
  >(null);

  //effect description
  useEffect(() => {
    if (selectedMunicipality) {
      // get municipality nested places options
      const citiesOptions = getMunicipalityPlaces(selectedMunicipality.id);
      if (citiesOptions) {
        setCities(citiesOptions);
      }

      const getCoordinates = getPlaceCoordinates(selectedMunicipality.jsonId);
      console.log(getCoordinates);
      if (getCoordinates) {
        setMunicipalityCoordinates(
          getCoordinates as unknown as LatLngExpression[][][],
        );
      }
    }
  }, [selectedMunicipality]);
  useEffect(() => {
    if (selectedCity) {
      // get municipality nested places options

      const getCoordinates = getPlaceCoordinates(selectedCity.jsonId);
      if (getCoordinates) {
        console.log(getCoordinates);

        setCityCoordinates(getCoordinates as unknown as LatLngExpression[][][]);
      }
    }
  }, [selectedCity]);
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div
        style={{
          position: "absolute",
          left: "50px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
        }}
      >
        <select
          onChange={(e) =>
            setSelectedMunicipality(
              municipalitiesOptions.find((m) => m.id === e.target.value) ||
                null,
            )
          }
        >
          <option value="">Select Municipality</option>
          {municipalitiesOptions.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          onChange={(e) =>
            setSelectedCity(cities.find((c) => c.id === e.target.value) || null)
          }
        >
          <option value="">Select City/Village</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
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

        {municipalityCoordinates && (
          <Polygon positions={municipalityCoordinates} color="black" />
        )}
        {cityCoordinates && (
          <Polygon positions={cityCoordinates} color="blue" />
        )}

        {/* {selectedCity && (
          <Marker position={selectedCity.centerPoint}>
            <Popup>{selectedCity.name}</Popup>
          </Marker>
        )} */}
      </MapContainer>
    </div>
  );
}
