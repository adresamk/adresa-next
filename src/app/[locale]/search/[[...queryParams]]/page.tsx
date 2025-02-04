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
import { Metadata } from "next";

export const revalidate = 60;
export const dynamicParams = true;

export const metadata: Metadata = {
  title: "Adresa.mk - Пребарајте недвижини",
  description: "Пребарајте недвижини",
  keywords: [
    "realestate",
    "real estate",
    "недвижини",
    "недвижински огласи",
    "apartment",
  ],
  authors: [{ name: "Mario K", url: "https://mariok.mk" }],
  creator: "Mario K",
  publisher: "Adresa",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

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

  console.log("queryParams", queryParams);
  console.log("searchParams", parsedSearchParams);

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
      async () => getAllListings(parsedQueryParams),
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
