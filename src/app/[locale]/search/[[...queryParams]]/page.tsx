import SearchResults from "@/components/shared/SearchResults";
import { searchParamsCache } from "../../searchParams";
// import getAllListings from "@/server/actions/listing.actions";
import { parseQueryParams } from "@/lib/filters";
import Custom404 from "./_components/Custom404";
import { unstable_cache } from "next/cache";
import { Feature, Listing, ListingFeature } from "@prisma/client";
import {
  getAllListingsByBoundingBox,
  getAllListings,
} from "@/server/actions/listing.gets";
import { getLocale, getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/routing";
import path from "path";
import {
  getAllRegionsTranslated,
  getMunicipalityOptionsTranslated,
} from "@/lib/data/macedonia/importantData";

export const revalidate = 60;
export const dynamicParams = true;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ queryParams: string[] }>;
}) {
  const locale = await getLocale();
  const t = await getTranslations();
  const paramss = await params;
  const tt = paramss.queryParams
    .find((param) => param.startsWith("tt-"))
    ?.split("-")[1];
  const l = paramss.queryParams
    .find((param) => param.startsWith("l-"))
    ?.split("-")[1];
  const c = paramss.queryParams
    .find((param) => param.startsWith("c-"))
    ?.split("-")[1];

  const muniTranslated = getMunicipalityOptionsTranslated(locale);
  const regions = getAllRegionsTranslated();

  const locationLabel = l
    ?.split(",")
    .map((place: string) => {
      // console.log("place", place);
      if (place.startsWith("0")) {
        const region = regions.find((r) => r.value === place);
        // console.log("region", region);
        return region?.label[locale as keyof typeof region.label];
      }
      const municipality = muniTranslated.find((m) => m.value === place)?.label;
      return municipality;
    })
    .join(", ");

  let title = `${c && t(`search.filters.category.${c}`)} ${t("common.words.for")} ${t(`search.filters.mode.${tt}`).toLowerCase()} ${t("common.words.in")} ${locationLabel}`;

  // console.log("title", paramss);
  return {
    title: title,
    description: "Пребарајте недвижнини",
    keywords: [
      "realestate",
      "real estate",
      "недвижнини",
      "недвижински огласи",
      "apartment",
    ],
    robots: {
      index: true,
      follow: false,
      googleBot: {
        index: true,
        follow: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
// export const metadata: Metadata = {
//   title: "1 Adresa.mk - Пребарајте недвижнини",
//   description: "1 Пребарајте недвижнини",
// };

interface SearchPageProps {
  searchParams: Promise<Record<string, string>>;
  params: Promise<{ queryParams: string[]; locale: string }>;
}

export default async function SearchPage({
  searchParams,
  params,
}: SearchPageProps) {
  const parsedSearchParams = await searchParams;
  // console.log("parsedSearchParams", parsedSearchParams);
  // const parsedParams = searchParamsCache.parse(parsedSearchParams);

  const { queryParams, locale } = await params;

  // console.log("queryParams", queryParams);
  // console.log("searchParams", parsedSearchParams);

  const parsedQueryParams = parseQueryParams(queryParams);
  // console.log("parsedQueryParams", parsedQueryParams);
  // console.log("parsedQueryParams", JSON.stringify(parsedQueryParams));
  // console.log("queryParams", queryParams);
  const locationMissing =
    !queryParams ||
    !queryParams.some((param) => param.startsWith("l-") && param.length > 2);
  if (locationMissing) {
    return <Custom404 />;
  }

  // console.log("parsedQueryParams", parsedQueryParams);

  let listings: Listing[] = [];
  if (parsedQueryParams.location && parsedQueryParams.location === "ms") {
    listings = await getAllListingsByBoundingBox(
      parsedQueryParams,
      parsedSearchParams,
    );
  } else {
    listings = await unstable_cache(
      async () => {
        let listings = await getAllListings(parsedQueryParams);

        // Separate listings into valid prices and special cases (null or < 20)
        const validPrices = listings.filter((l) => l.price && l.price >= 20);
        const specialCases = listings.filter((l) => !l.price || l.price < 20);

        // Sort valid prices in descending order
        // validPrices.sort((a, b) => b.price! - a.price!);

        // Combine arrays with special cases at the end
        return [...validPrices, ...specialCases];
      },
      ["listings", JSON.stringify(parsedQueryParams)],
      {
        revalidate: 60,
      },
    )();
  }

  // FILTER BY FEATURES
  const featureKeysAsString = parsedSearchParams.f;
  // console.log("featureKeysAsString", featureKeysAsString);
  if (featureKeysAsString && featureKeysAsString.length > 0) {
    const featureKeys = featureKeysAsString.split(",");
    listings = listings.filter((listing, idx) => {
      const lwf = listing as Listing & {
        listingFeatures: (ListingFeature & {
          feature: Feature;
        })[];
      };

      const appliedFeaturesKeys = lwf.listingFeatures.map(
        (lf) => lf.feature.key,
      );
      return featureKeys.every((key) => appliedFeaturesKeys.includes(key));
      //
    });
  }

  return (
    <main className="min-h-screen bg-white">
      <SearchResults listings={listings} />
    </main>
  );
}
