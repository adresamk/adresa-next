import { LatLngExpression } from "leaflet";
import mappedStructure from "./mappedStructure.json";
import mappedCoordinatesCustom from "./mappedCoordinatesCustom.json";

// Define the MappedCoordinates type
export type MappedCoordinates = {
  [key: string]: LatLngExpression[][][]; // Expecting a 3D array
};

export type TranslatedOption = {
  label: string;
  value: string;
};

export const skopjeCoordinates: [number, number] = [42.005, 21.422];
export const northMacedoniaCoordinates: [number, number] = [41.56614, 21.698];

/**
 * Returns an array of all municipality IDs
 */
export function getMunicipalitiesOptions(): string[] {
  return Object.keys(mappedStructure);
}

/**
 * Returns coordinates for given IDs
 * @param ids Array of place IDs
 * @returns Array of objects mapping IDs to their coordinates
 */
export function getCoordinates(ids: string[]): Array<{ [key: string]: number[] }> {
  return ids.map(id => ({
    [id]: mappedCoordinatesCustom[id as keyof typeof mappedCoordinatesCustom]
  })).filter(coord => Object.values(coord)[0] !== undefined);
}

/**
 * Returns municipality and its places
 * @param municipalityId Municipality ID
 * @returns Object containing municipality ID and array of place IDs
 */
export function getMunicipalityPlaces(municipalityId: string): {
  municipality: string;
  places: string[];
} {
  return {
    municipality: municipalityId,
    places: mappedStructure[municipalityId as keyof typeof mappedStructure] || []
  };
}

/**
 * Returns coordinates for all places in a municipality
 * @param municipalityId Municipality ID
 * @returns Array of objects mapping place IDs to their coordinates
 */
export function getMunicipalityCoordinates(municipalityId: string): Array<{ [key: string]: number[] }> {
  const places = mappedStructure[municipalityId as keyof typeof mappedStructure];
  if (!places) return [];
  
  return getCoordinates(places);
}

/**
 * Returns translated municipality options for dropdowns
 * @param locale The current locale (e.g., 'en', 'mk', 'al')
 * @returns Array of objects with label (translated name) and value (municipality ID)
 */
export function getTranslatedMunicipalityOptions(locale: string = "mk"): TranslatedOption[] {
  const municipalities = getMunicipalitiesOptions();
  // Dynamic import of translations based on locale
  const translations = require(`../../../messages/places/${locale}.places.json`);
  
  return municipalities.map(id => ({
    value: id,
    label: translations[id] || id // Fallback to ID if translation missing
  })).sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Returns translated place options for a specific municipality
 * @param municipalityId Municipality ID
 * @param locale The current locale (e.g., 'en', 'mk', 'al')
 * @returns Array of objects with label (translated name) and value (place ID)
 */
export function getTranslatedMunicipalityPlaces(
  municipalityId: string,
  locale: string = "mk"
): TranslatedOption[] {
  const { places } = getMunicipalityPlaces(municipalityId);
  const translations = require(`../../../messages/places/${locale}.places.json`);

  return places.map(id => ({
    value: id,
    label: translations[id] || id // Fallback to ID if translation missing
  })).sort((a, b) => a.label.localeCompare(b.label));
}

// Example usage:
// const municipalities = getMunicipalitiesOptions();
// const coords = getCoordinates(['20101', '20102']);
// const municipalityInfo = getMunicipalityPlaces('10001');
// const municipalityCoords = getMunicipalityCoordinates('10001');
