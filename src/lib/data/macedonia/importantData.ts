type MappedCoordinates = {
  [key: string]: LatLngExpression[][][]; // Adjust the inner type as necessary
};
import { LatLngExpression } from "leaflet";
import mappedCoordinates from "./macedoniaCoordinatesById.json";
const typedMappedCoordinates = mappedCoordinates as MappedCoordinates;
import { PopulatedPlace, populatedPlaces } from "./macedoniaPopulatedPlaces";

// Define the type for mappedCoordinates

export const skopjeCoordinates: [number, number] = [42.005, 21.422];
export const northMacedoniaCoordinates: [number, number] = [41.56614, 21.698];

export const municipalitiesOptions: PopulatedPlace[] = populatedPlaces.map(
  (place) => {
    return {
      id: place.id,
      jsonId: place.jsonId,
      name: place.name,
    };
  },
);

export function getMunicipalityPlaces(
  municipalityId: string,
): PopulatedPlace[] | null {
  const places: PopulatedPlace | undefined = populatedPlaces.find(
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
  const swappedCoordinates = placeCoordinates.map((first) => {
    return first.map((second) => {
      return second.map((coordinates) => {
        const coord = coordinates as [number, number]; // Cast to the correct type
        return [coord[1], coord[0]];
      });
    });
  });
  console.log(swappedCoordinates);
  if (placeCoordinates) {
    return swappedCoordinates;
  }
  return null;
}
