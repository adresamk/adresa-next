"use client";

import {
  getCoordinates2,
  getMunicipalities2,
  getPlaces2,
  MappedCoordinates,
  northMacedoniaCoordinates,
  skopjeCoordinates,
} from "@/lib/data/macedonia/importantData";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { PopulatedPlace } from "@/lib/data/macedonia/macedoniaPopulatedPlaces2";
import { LatLngExpression } from "leaflet";

export default function PlacesTestMap() {
  const municipalities = getMunicipalities2();
  //   const [municipalities, setMunicipalities] = useState<PopulatedPlace[]>(getMunicipalities2());
  const [places, setPlaces] = useState<PopulatedPlace[]>([]);

  const [selectedMunicipality, setSelectedMunicipality] =
    useState<PopulatedPlace>();
  const [selectedPlace, setSelectedPlace] = useState<PopulatedPlace>();

  useEffect(() => {
    if (selectedMunicipality) {
      const newPlaces = getPlaces2(selectedMunicipality.id);
      //   console.log(newPlaces);
      setPlaces(newPlaces);
    }
  }, [selectedMunicipality]);
  const [polygonVisibility, setPolygonVisibility] = useState({
    currentMunicipality: false,
    currentPlace: false,
    allMunicipalities: false,
    allPlacesFromSelectedMunicipality: false,
  });

  let currentMunicipalityPolygon: LatLngExpression[][][] = selectedMunicipality
    ? (getCoordinates2(selectedMunicipality.id) as LatLngExpression[][][])
    : [];
  let currentPlacePolygon: LatLngExpression[][][] = selectedPlace
    ? (getCoordinates2(selectedPlace.id) as LatLngExpression[][][])
    : [];
  //   console.log("rerender", selectedPlace?.id);
  //   console.log("currentPlacePolygon", { currentPlacePolygon });
  let allMunicipalitiesPolygons: MappedCoordinates = getCoordinates2(
    municipalities.map((m) => m.id),
  ) as MappedCoordinates;
  let allPlacesFromSelectedMunicipalityPolygons: MappedCoordinates =
    selectedMunicipality && places.length > 0
      ? (getCoordinates2(places.map((p) => p.id)) as MappedCoordinates)
      : {};

  //   let currentMunicipalityPolygon: LatLngExpression[][][] = [];
  // let currentPlacePolygon = []
  //   let allMunicipalitiesPolygons: MappedCoordinates = {};
  //   let allPlacesFromSelectedMunicipalityPolygons: MappedCoordinates = {};

  return (
    <div>
      <div className="h-[220px] w-[400px]">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="municipality" className="mb-2 block">
              Select Municipality
            </label>
            <select
              id="municipality"
              className="w-full rounded border p-2"
              value={selectedMunicipality?.id || ""}
              onChange={(e) => {
                const municipality = municipalities.find(
                  (m) => m.id === Number(e.target.value),
                );
                setSelectedMunicipality(municipality);
                setSelectedPlace(undefined);
              }}
            >
              <option value="">Select a municipality</option>
              {municipalities.map((municipality) => (
                <option key={municipality.id} value={municipality.id}>
                  {municipality.name || municipality.name_en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="place" className="mb-2 block">
              Select Place
            </label>
            <select
              id="place"
              className="w-full rounded border p-2"
              value={selectedPlace?.id || ""}
              onChange={(e) => {
                const place = places.find(
                  (p) => p.id === Number(e.target.value),
                );

                setSelectedPlace(place);
              }}
              disabled={!selectedMunicipality}
            >
              <option value="">Select a place</option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name || place.name_en}
                </option>
              ))}
            </select>
          </div>
          {/* Checkboxes */}
          <div>
            {/* Checkboxes for polygon visibility */}
            <label>
              <input
                type="checkbox"
                checked={polygonVisibility.currentMunicipality}
                onChange={() =>
                  setPolygonVisibility((prev) => ({
                    ...prev,
                    currentMunicipality: !prev.currentMunicipality,
                  }))
                }
              />
              Current Municipality
            </label>
            <label>
              <input
                type="checkbox"
                checked={polygonVisibility.currentPlace}
                onChange={() =>
                  setPolygonVisibility((prev) => ({
                    ...prev,
                    currentPlace: !prev.currentPlace,
                  }))
                }
              />
              Current Place
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={polygonVisibility.allMunicipalities}
                onChange={() =>
                  setPolygonVisibility((prev) => ({
                    ...prev,
                    allMunicipalities: !prev.allMunicipalities,
                  }))
                }
              />
              All Municipalities
            </label>
            <label>
              <input
                type="checkbox"
                checked={polygonVisibility.allPlacesFromSelectedMunicipality}
                onChange={() =>
                  setPolygonVisibility((prev) => ({
                    ...prev,
                    allPlacesFromSelectedMunicipality:
                      !prev.allPlacesFromSelectedMunicipality,
                  }))
                }
              />
              All Places from Selected Municipality
            </label>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-[500px]">
        <MapContainer
          center={northMacedoniaCoordinates}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />

          {polygonVisibility.currentMunicipality && (
            <Polygon positions={currentMunicipalityPolygon} color="green" />
          )}
          {polygonVisibility.currentPlace && (
            <Polygon positions={currentPlacePolygon} color="yellow" />
          )}
          {polygonVisibility.allMunicipalities &&
            Object.keys(allMunicipalitiesPolygons).length > 0 &&
            Object.entries(allMunicipalitiesPolygons).map(
              ([key, value], index) => {
                const blueShades = [
                  "#ADD8E6",
                  "#87CEEB",
                  "#4682B4",
                  "#6495ED",
                  "#4682B4",
                  "#4169E1",
                  "#3A5FCD",
                  "#2F4F7F",
                  "#1E90FF",
                  "#007BFF",
                  "#007ACC",
                  "#0066CC",
                  "#0056B3",
                  "#004D99",
                  "#003366",
                ];
                return (
                  <Polygon
                    key={key}
                    positions={value}
                    color={blueShades[index % blueShades.length]}
                  />
                );
              },
            )}
          {polygonVisibility.allPlacesFromSelectedMunicipality &&
            Object.keys(allPlacesFromSelectedMunicipalityPolygons).length > 0 &&
            Object.entries(allPlacesFromSelectedMunicipalityPolygons).map(
              ([key, value], index) => {
                const redShades = [
                  "#FF0000",
                  "#FF4500",
                  "#FFA500",
                  "#FFD700",
                  "#FFFF00",
                  "#FF6347",
                  "#FF7F50",
                  "#FF8C00",
                  "#FFA07A",
                  "#FFC080",
                ];
                if (index === 0) {
                  //   console.log(key);
                  //   console.log(value);
                  //   console.log(value[0]);
                  //   console.log(value[0][0]);
                }
                return (
                  <Polygon
                    key={key}
                    positions={value}
                    color={redShades[index % redShades.length]}
                  />
                );
              },
            )}
        </MapContainer>
      </div>
    </div>
  );
}
