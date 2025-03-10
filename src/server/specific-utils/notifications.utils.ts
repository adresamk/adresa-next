import { parseQueryParams } from "@/lib/filters";
// import {translations} from "@/lib/data/macedonia/importantData";
import enPlacesTranslations from "@/messages/places/en.places.json";

export function unpackOriginalSavedSearchParams(searchParams: string) {
  let parsedQueryParams = parseQueryParams(searchParams.split("/"));
  // translate locale
  let locTranslated = parsedQueryParams.location;
  if (locTranslated) {
    if (!Array.isArray(parsedQueryParams.location)) {
      locTranslated = [locTranslated];
    }

    parsedQueryParams.location = locTranslated;
  }
  if (parsedQueryParams.priceLow) {
    parsedQueryParams.priceLow = Number(parsedQueryParams.priceLow);
  }
  if (parsedQueryParams.priceHigh) {
    parsedQueryParams.priceHigh = Number(parsedQueryParams.priceHigh);
  }
  if (parsedQueryParams.areaLow) {
    parsedQueryParams.areaLow = Number(parsedQueryParams.areaLow);
  }
  if (parsedQueryParams.areaHigh) {
    parsedQueryParams.areaHigh = Number(parsedQueryParams.areaHigh);
  }
  console.log("unpacked original", parsedQueryParams);
  return parsedQueryParams;
}
export function unpackSavedSearchParams(searchParams: string) {
  //   get the basics
  let parsedQueryParams = parseQueryParams(searchParams.split("/"));
  // translate locale
  let locTranslated = parsedQueryParams.location;
  if (locTranslated) {
    if (!Array.isArray(parsedQueryParams.location)) {
      locTranslated = [locTranslated];
    }

    locTranslated = locTranslated.map((location: string) => {
      return (
        enPlacesTranslations[location as keyof typeof enPlacesTranslations] ||
        location
      );
    });
    parsedQueryParams.location = locTranslated;
  }
  Object.keys(parsedQueryParams).forEach((key) => {
    if (parsedQueryParams[key] === undefined) {
      delete parsedQueryParams[key];
    }
  });
  delete parsedQueryParams.sorting;
  console.log("parsedQueryParams", parsedQueryParams);

  return parsedQueryParams;
}
