import SearchResults from "@/components/shared/SearchResults";
import { searchParamsCache } from "../../searchParams";
// import getAllListings from "@/server/actions/listing.actions";
import { parseQueryParams } from "@/lib/filters";
import Custom404 from "./_components/Custom404";
import { unstable_cache } from "next/cache";
import { Listing } from "@prisma/client";
import {
  getAllListingsByBoundingBox,
  getAllListings,
} from "@/server/actions/listing.gets";

export const revalidate = 60;
export const dynamicParams = true;

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

  console.log("parsedQueryParams", parsedQueryParams);

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

  return (
    <main className="min-h-screen bg-white">
      <SearchResults listings={listings} />
    </main>
  );
}
