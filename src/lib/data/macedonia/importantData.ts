import { LatLngExpression } from "leaflet";
import mappedCoordinates from "./macedoniaCoordinatesById.json";

// Define the MappedCoordinates type
type MappedCoordinates = {
  [key: string]: LatLngExpression[][][]; // Expecting a 3D array
};

// Transform the data if necessary
const typedMappedCoordinates: MappedCoordinates = Object.fromEntries(
  Object.entries(mappedCoordinates).map(([key, value]) => [
    key,
    value.map(
      (
        coords: number[][][], // Adjusted to expect a 3D array
      ) =>
        coords.map(
          (
            coord: number[][], // Change type to number[][]
          ) => coord.map((c: number[]) => [c[0], c[1]] as LatLngExpression), // Ensure each coordinate is a LatLngExpression
        ),
    ),
  ]),
);

import {
  PopulatedPlace,
  municipalitiesWithPlaces,
} from "./macedoniaPopulatedPlaces";

export const skopjeCoordinates: [number, number] = [42.005, 21.422];
export const northMacedoniaCoordinates: [number, number] = [41.56614, 21.698];

export const municipalitiesOptions: PopulatedPlace[] =
  municipalitiesWithPlaces.map((place) => {
    return {
      id: place.id,
      jsonId: place.jsonId,
      name: place.name,
    };
  });

export function getMunicipalityPlaces(
  municipalityId: string,
): PopulatedPlace[] | null {
  const places: PopulatedPlace | undefined = municipalitiesWithPlaces.find(
    (place) => place.id === municipalityId,
  );
  if (places) {
    if (!places.inner) {
      return null;
    }
    if (places.inner.length === 0) {
      return null;
    }
    return places.inner.map((place) => {
      return {
        id: place.id,
        jsonId: place.jsonId,
        name: place.name,
      };
    });
  } else {
    return null;
  }
}

export function getPlaceCoordinates(placeId: number | undefined) {
  if (!placeId) {
    return null;
  }
  const placeCoordinates = typedMappedCoordinates[String(placeId)];
  // itterate and swap coordinates lat and lng positions
  if (!placeCoordinates) {
    return null;
  }
  const swappedCoordinates = placeCoordinates.map((first) => {
    return first.map((second) => {
      return second.map((coordinates) => {
        const coord = coordinates as [number, number]; // Cast to the correct type
        return [coord[1], coord[0]];
      });
    });
  });
  if (placeCoordinates) {
    return swappedCoordinates as LatLngExpression[][][];
  }
  return null;
}
