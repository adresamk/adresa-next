import SearchResults from "@/components/shared/SearchResults";
import { agencyExample, listings } from "@/global/data";
import getAllListings from "@/requests/getAllListings";
import { createSearchParamsCache, parseAsString } from "nuqs/server"; // Note: import from 'nuqs/server' to avoid the "use client" directive

const searchParamsCache = createSearchParamsCache({
  propertyType: parseAsString.withDefault(""),
});

interface SearchPageProps {
  searchParams: Record<string, string>;
}
export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const parsedParams = searchParamsCache.parse(searchParams);
  const listings = await getAllListings(parsedParams.propertyType);
  console.log("Re-run server component");
  return (
    <main className="bg-white min-h-screen">
      <SearchResults listings={listings} />
    </main>
  );
}
