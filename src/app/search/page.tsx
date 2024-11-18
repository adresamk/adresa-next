import SearchResults from "@/components/shared/SearchResults";
import getAllListings from "@/requests/getAllListings";
import { searchParamsCache } from "../searchParams";

interface SearchPageProps {
  searchParams: Promise<Record<string, string>>;
}
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const parsedSearchParams = await searchParams;
  const parsedParams = searchParamsCache.parse(parsedSearchParams);
  console.log("Re-run server component", Math.random(), parsedParams);
  // @ts-ignore
  const listings = await getAllListings(parsedParams);
  return (
    <main className="min-h-screen bg-white">
      <SearchResults listings={listings} />
    </main>
  );
}
