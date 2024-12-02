import { LatLngExpression } from "leaflet";
import mappedCoordinates from "./macedoniaCoordinatesById.json";
import mappedCoordinates2 from "./macedoniaCoordinatesById2.json";

// Define the MappedCoordinates type
export type MappedCoordinates = {
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

// Debug the raw data first
// console.log('Raw mappedCoordinates2 keys:', Object.keys(mappedCoordinates2).length);
// console.log('Sample of first few IDs:', Object.keys(mappedCoordinates2).slice(0, 5));

// Add type checking and validation
const typedMappedCoordinates2: MappedCoordinates = Object.fromEntries(
  Object.entries(mappedCoordinates2).map(([key, value]) => {
    // Validate the raw data structure
    if (!Array.isArray(value)) {
      console.error(`Invalid data structure for key ${key}:`, value);
      return [key, []];
    }

    try {
      const processedValue = value.map((coords: number[][][]) =>
        coords.map((coord: number[][]) =>
          coord.map((c: number[]) => {
            if (!Array.isArray(c) || c.length !== 2) {
              throw new Error(
                `Invalid coordinate format for key ${key}: ${JSON.stringify(c)}`,
              );
            }
            // Create a new array for each coordinate
            return [c[0], c[1]] as LatLngExpression;
          }),
        ),
      );

      // Verify the processed data
      if (processedValue.length > 0 && processedValue[0].length > 0) {
        // console.log(`Processed first coordinate for ${key}:`, processedValue[0][0][0]);
      }

      return [key, processedValue];
    } catch (error) {
      // console.error(`Error processing coordinates for key ${key}:`, error);
      return [key, []];
    }
  }),
);

// Verify the final data structure
// console.log('Processed typedMappedCoordinates2 keys:', Object.keys(typedMappedCoordinates2).length);

import {
  PopulatedPlace,
  municipalitiesWithPlaces,
} from "./macedoniaPopulatedPlaces";
import { municipalities } from "./macedoniaPopulatedPlaces2";

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

// almost always expecting the hit when using in my UI
export function getMunicipalityInfo(municipalityId: string) {
  const municipality = municipalitiesWithPlaces.find(
    (place) => place.id === municipalityId,
  );
  if (!municipality) {
    console.error("Municipality not found", municipalityId);
  }
  return municipality;
}

export function getPlaceInfo(placeId: string, municipalityId?: string) {
  let place = municipalitiesWithPlaces.find((place) => place.id === placeId);
  if (municipalityId) {
    const municipality = municipalitiesWithPlaces.find(
      (place) => place.id === municipalityId,
    );
    if (municipality && municipality.inner) {
      place = municipality.inner.find((place) => place.id === placeId);
    }
  } else {
    place = municipalitiesWithPlaces.find((municipality) => {
      if (municipality.inner) {
        return municipality.inner.find((place) => place.id === placeId);
      }
      return false;
    });
  }
  return place;
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
  if (placeCoordinates) {
    const swappedCoordinates = placeCoordinates.map((first) => {
      return first.map((second) => {
        return second.map((coordinates) => {
          const coord = coordinates as [number, number]; // Cast to the correct type
          return [coord[1], coord[0]];
        });
      });
    });
    return swappedCoordinates as LatLngExpression[][][];
  }
  return null;
}
function getLookupKey(id: number | number[] | string | string[]) {
  let lookupKey = "";
  if (Array.isArray(id)) {
    if (typeof id[0] === "number") {
      lookupKey = "id";
    } else {
      lookupKey = "customId";
    }
  } else {
    if (typeof id === "number") {
      lookupKey = "id";
    } else {
      lookupKey = "customId";
    }
  }
  return lookupKey;
}
export function getCoordinates2(id: number | number[]) {
  if (Array.isArray(id)) {
    const coordinatesObj: MappedCoordinates = {};
    id.forEach((singleId) => {
      const coords = typedMappedCoordinates2[singleId];

      if (!coords || !Array.isArray(coords) || coords.length === 0) {
        // console.warn(`No valid coordinates found for id ${singleId}`);
        coordinatesObj[String(singleId)] = [];
        return;
      }

      try {
        // Process the coordinates with validation
        const processedCoords = coords.map((polygon, pIndex) => {
          if (!Array.isArray(polygon)) {
            throw new Error(`Invalid polygon at index ${pIndex}`);
          }
          return polygon.map((ring, rIndex) => {
            if (!Array.isArray(ring)) {
              throw new Error(
                `Invalid ring at polygon ${pIndex}, ring ${rIndex}`,
              );
            }
            return ring.map((coord, cIndex) => {
              if (!Array.isArray(coord) || coord.length !== 2) {
                throw new Error(
                  `Invalid coordinate at p${pIndex}:r${rIndex}:c${cIndex}`,
                );
              }
              // Create new coordinate array and swap lat/lng
              return [coord[1], coord[0]] as LatLngExpression;
            });
          });
        });

        // Log the first coordinate for verification
        if (
          processedCoords.length > 0 &&
          processedCoords[0].length > 0 &&
          processedCoords[0][0].length > 0
        ) {
          // console.log(`ID ${singleId} first coordinate:`, {
          //   raw: coords[0][0][0],
          //   processed: processedCoords[0][0][0],
          // });
        }

        coordinatesObj[String(singleId)] = processedCoords;
      } catch (error) {
        // console.error(
        //   `Error processing coordinates for id ${singleId}:`,
        //   error,
        // );
        coordinatesObj[String(singleId)] = [];
      }
    });

    return coordinatesObj;
  } else {
    const coords = typedMappedCoordinates2[String(id)];

    if (!coords || !Array.isArray(coords) || coords.length === 0) {
      // console.warn(`No valid coordinates found for id ${id}`);
      return [];
    }

    try {
      // Process the coordinates with validation
      return coords.map((polygon, pIndex) => {
        if (!Array.isArray(polygon)) {
          // throw new Error(`Invalid polygon at index ${pIndex}`);
        }
        return polygon.map((ring, rIndex) => {
          if (!Array.isArray(ring)) {
            // throw new Error(
            //   `Invalid ring at polygon ${pIndex}, ring ${rIndex}`,
            // );
          }
          return ring.map((coord, cIndex) => {
            if (!Array.isArray(coord) || coord.length !== 2) {
              // throw new Error(
              //   `Invalid coordinate at p${pIndex}:r${rIndex}:c${cIndex}`,
              // );
            }
            // Create new coordinate array and swap lat/lng
            const coord2 = coord as [number, number]; // Ensure coord is explicitly typed as a tuple
            return [coord2[1], coord2[0]] as LatLngExpression;
          });
        });
      });
    } catch (error) {
      // console.error(`Error processing coordinates for id ${id}:`, error);
      return [];
    }
  }
}
export function getMunicipalities2() {
  return municipalities.map((m) => {
    return {
      id: m.id,
      customId: m.customId,
      name_en: m.name_en,
      name: m.name,
    };
  });
}

export function getPlaces2(municipalityId: number | string) {
  const lookupKey: string = getLookupKey(municipalityId);
  const municipality = municipalities.find(
    (m) => m[lookupKey as keyof typeof m] === municipalityId,
  );
  if (!municipality) {
    return [];
  }
  return municipality.places ?? [];
}
