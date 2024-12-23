import { defaultFilters } from "@/hooks/useFilters";
import { PropertyCategory, PropertyTransactionType } from "@prisma/client";
import { FiltersObject } from "./types";

const mainFiltersDefaults = {
  location: undefined,
  transactionType: PropertyTransactionType.sale,
  category: PropertyCategory.residential,
  type: undefined,
  priceLow: undefined,
  priceHigh: undefined,
  areaLow: undefined,
  areaHigh: undefined,
  sorting: "new",
};

export const mainFiltersShort: Record<string, string> = {
  l: "location",
  tt: "transactionType",
  c: "category",
  t: "type",
  pl: "priceLow",
  ph: "priceHigh",
  al: "areaLow",
  ah: "areaHigh",
  s: "sorting",
};
const mainFilters = [
  "location",
  "transactionType",
  "category",
  "type",
  "priceLow",
  "priceHigh",
  "areaLow",
  "areaHigh",
  "sorting",
];
type MainFilters =
  | "location"
  | "transactionType"
  | "category"
  | "type"
  | "priceLow"
  | "priceHigh"
  | "areaLow"
  | "areaHigh"
  | "sorting";

export type ParsedQueryParams = {
  location: string | string[] | undefined;
  transactionType: string | undefined;
  category: string | undefined;
  type: string | undefined;
  priceLow: number | undefined;
  priceHigh: number | undefined;
  areaLow: number | undefined;
  areaHigh: number | undefined;
  sorting: string | undefined;
};

function cleanedUpLocation(location: string | string[]) {
  if (Array.isArray(location)) {
    const filtered = location.filter(
      (l) => l.length === 5 && (l.startsWith("1") || l.startsWith("2")),
    );
    if (filtered.length === 0) {
      return undefined;
    }
    return filtered;
  }

  if (
    location.length === 5 &&
    (location.startsWith("1") || location.startsWith("2"))
  ) {
    return location;
  }

  return undefined;
}

export function parseQueryParams(params: string[] = []) {
  const parsedParams: Record<string, string | string[] | number> = {};
  // console.log("params", params);
  for (const param of params) {
    const [key, value] = param.split("-");
    if (mainFilters.includes(mainFiltersShort[key])) {
      if (!value) {
        continue;
      }
      const decodedParams = decodeURIComponent(value);
      if (key === "l") {
        if (decodedParams.includes(",")) {
          parsedParams[mainFiltersShort[key]] = decodedParams
            .split(",")
            .filter(Boolean);
        } else {
          parsedParams[mainFiltersShort[key]] = value;
        }
        const cleanedLocation = cleanedUpLocation(
          parsedParams[mainFiltersShort[key]] as string | string[],
        );
        if (cleanedLocation) {
          parsedParams[mainFiltersShort[key]] = cleanedLocation;
        } else {
          delete parsedParams[mainFiltersShort[key]];
        }
      } else {
        parsedParams[mainFiltersShort[key]] = value;
        // isNaN(Number(value))
        //   ? value
        //   : Number(value);
      }
    }
  }

  const filteredParams = mainFilters.reduce(
    (acc, filter) => {
      if (parsedParams[filter]) {
        acc[filter] = parsedParams[filter];
      } else {
        acc[filter] =
          mainFiltersDefaults[filter as keyof typeof mainFiltersDefaults];
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  return filteredParams;
}

export function extractFromUrl(pathname: string, filter: MainFilters) {
  // console.log("extractFromUrl", pathname, filter);
  const parsedQueryParams = parseQueryParams(pathname.split("/"));

  // console.log("parsedQueryParams", parsedQueryParams);
  // console.log("output", filter, parsedQueryParams[filter] || "");
  return parsedQueryParams[filter] || "";
}

export function replaceFilterInUrl(
  pathname: string,
  filter: MainFilters,
  value: string,
) {
  const parsedQueryParams = parseQueryParams(pathname.split("/"));
  // console.log(value, typeof value);
  parsedQueryParams[filter] = value;
  const newUrl = generateSearchUrl(parsedQueryParams as FiltersObject);
  // console.log("newUrl", newUrl);
  return newUrl;
}

export function generateSearchUrl(filters: FiltersObject) {
  return `/search/${Object.entries(filters)
    .filter(([_, value]) => {
      // console.log(value, typeof value);
      return value !== "" && value !== undefined;
    })
    .map(([key, value]) => {
      const shortKey = Object.entries(mainFiltersShort).find(
        ([_, long]) => long === key,
      )?.[0];
      return `${shortKey}-${value}`;
    })
    .join("/")}`;
}
