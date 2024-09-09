import { searchParamsCache } from "@/app/searchParams";
import SearchResults from "@/components/shared/SearchResults";
import { agencyExample } from "@/global/data";
import getAllListings from "@/requests/getAllListings";

interface SearchPageProps {
  searchParams: Record<string, string>;
}

const agency = agencyExample;
export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const parsedParams = searchParamsCache.parse(searchParams);
  console.log("Re-run server component", Math.random(), parsedParams);
  // @ts-ignore
  const listings = await getAllListings(parsedParams);
  return (
    <main className="bg-white min-h-screen">
      <SearchResults listings={listings} agency={agency} />
    </main>
  );
}
