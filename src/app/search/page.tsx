import SearchResults from "@/components/shared/SearchResults";
import getAllListings from "@/requests/getAllListings";
import { searchParamsCache } from "../searchParams";

interface SearchPageProps {
  searchParams: Record<string, string>;
}
export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const parsedParams = searchParamsCache.parse(searchParams);
  console.log("Re-run server component", Math.random(), parsedParams);
  // @ts-ignore
  const listings = await getAllListings(parsedParams);
  return (
    <main className="bg-white min-h-screen">
      <SearchResults listings={listings} />
    </main>
  );
}
