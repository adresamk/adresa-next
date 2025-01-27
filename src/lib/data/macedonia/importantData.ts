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
export type TranslatedOptionMultipleLanguages = {
  label: {
    mk: string;
    en: string;
    al: string;
  };
  value: string;
};

export const skopjeCoordinates: [number, number] = [42.005, 21.422];
export const northMacedoniaCoordinates: [number, number] = [41.56614, 21.698];

/**
 * Returns coordinates for given IDs
 * @param ids Array of place IDs
 * @returns Array of objects mapping IDs to their coordinates
 */
export function getCoordinates(
  ids: string[],
): Array<{ [key: string]: number[][][][] }> {
  return ids
    .map((id) => ({
      [id]: mappedCoordinatesCustom[id as keyof typeof mappedCoordinatesCustom],
    }))
    .filter((coord) => Object.values(coord)[0] !== undefined);
}
/**
 * Returns an array of all municipality IDs
 */
export function getMunicipalitiesOptions(): string[] {
  return Object.keys(mappedStructure);
}
/**
 * Returns translated municipality options for dropdowns
 * @param locale The current locale (e.g., 'en', 'mk', 'al')
 * @returns Array of objects with label (translated name) and value (municipality ID)
 */
export function getMunicipalityOptionsTranslated(
  locale: string = "mk",
): TranslatedOption[] {
  const municipalities = getMunicipalitiesOptions();
  // Dynamic import of translations based on locale
  const translations = require(
    `../../../messages/places/${locale}.places.json`,
  );

  return municipalities
    .map((id) => ({
      value: id,
      label: translations[id] || id, // Fallback to ID if translation missing
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Returns coordinates for all places in a municipality
 * @param municipalityId Municipality ID
 * @returns Array of objects mapping place IDs to their coordinates
 */
export function getMunicipalityCoordinates(
  municipalityId: string,
): Array<{ [key: string]: number[][][][] }> {
  const places =
    mappedStructure[municipalityId as keyof typeof mappedStructure];
  if (!places) return [];
  return getCoordinates(places);
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
  if (!municipalityId) {
    console.error("Municipality ID is required");
    return { municipality: "", places: [] };
  }
  return {
    municipality: municipalityId,
    places:
      mappedStructure[municipalityId as keyof typeof mappedStructure] || [],
  };
}

/**
 * Returns translated place options for a specific municipality
 * @param municipalityId Municipality ID
 * @param locale The current locale (e.g., 'en', 'mk', 'al')
 * @returns Array of objects with label (translated name) and value (place ID)
 */
export function getMunicipalityPlacesTranslated(
  municipalityId: string | undefined | null,
  locale: string = "mk",
): {
  municipality: TranslatedOption | null;
  places: TranslatedOption[];
} {
  if (!municipalityId) {
    // console.error("Municipality ID is required");
    return { municipality: null, places: [] };
  }

  const { places } = getMunicipalityPlaces(municipalityId)!;

  const translations = require(
    `../../../messages/places/${locale}.places.json`,
  );

  return {
    municipality: {
      value: municipalityId,
      label: translations[municipalityId] || municipalityId,
    },
    places: places
      .map((id) => ({
        value: id,
        label: translations[id] || id, // Fallback to ID if translation missing
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  };
}

export type TranslatedOptionWithMaybePlaces = TranslatedOption & {
  places?: TranslatedOption[];
};
export function getAllMunicipalitiesWithPlacesTranslated(
  locale: string = "mk",
): TranslatedOptionWithMaybePlaces[] {
  const municipalities = getMunicipalitiesOptions();
  const translations = require(
    `../../../messages/places/${locale}.places.json`,
  );

  return municipalities.map((id) => ({
    value: id,
    label: translations[id] || id,
    places: getMunicipalityPlacesTranslated(id, locale).places,
  }));
}

export function getAllLocationOptionsTranslated(): TranslatedOptionMultipleLanguages[] {
  const mkPlaces = getAllMunicipalitiesWithPlacesTranslated("mk");
  const enPlaces = getAllMunicipalitiesWithPlacesTranslated("en");
  const alPlaces = getAllMunicipalitiesWithPlacesTranslated("al");

  const placesMerged = mkPlaces.map((municipality) => {
    // Find corresponding translations for the municipality
    const enMunicipality = enPlaces.find((p) => p.value === municipality.value);
    const alMunicipality = alPlaces.find((p) => p.value === municipality.value);

    return {
      value: municipality.value,
      label: {
        mk: municipality.label,
        en: enMunicipality?.label || municipality.value,
        al: alMunicipality?.label || municipality.value,
      },
      places: municipality.places?.map((place) => {
        // Find corresponding translations for each place
        const enPlace = enMunicipality?.places?.find(
          (p) => p.value === place.value,
        );
        const alPlace = alMunicipality?.places?.find(
          (p) => p.value === place.value,
        );

        return {
          value: place.value,
          label: {
            mk: `${place.label || place.value}`,
            en: `${enPlace?.label || place.value}`,
            al: `${alPlace?.label || place.value}`,
          },
        };
      }),
    };
  });

  // const translatedPlaces = getAllMunicipalitiesWithPlacesTranslated(locale);

  const options: TranslatedOptionMultipleLanguages[] = placesMerged.reduce(
    (acc, municipality) => {
      acc.push({
        label: {
          mk: municipality.label.mk,
          en: municipality.label.en,
          al: municipality.label.al,
        },
        value: municipality.value,
      });
      if (municipality.places) {
        municipality.places.forEach((place) => {
          acc.push({
            label: {
              mk: `${municipality.label.mk}, ${place.label.mk}`,
              en: `${municipality.label.en}, ${place.label.en}`,
              al: `${municipality.label.al}, ${place.label.al}`,
            },
            value: place.value,
          });
        });
      }
      return acc;
    },
    [] as TranslatedOptionMultipleLanguages[],
  );

  return options;
}
