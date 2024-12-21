export const revalidate = 60;
import SearchResults from "@/components/shared/SearchResults";
import { searchParamsCache } from "../../searchParams";
import getAllListings from "@/server/actions/listing.actions";
import { parseQueryParams } from "@/lib/listings";
import Custom404 from "./_components/Custom404";

interface SearchPageProps {
  searchParams: Promise<Record<string, string>>;
  params: Promise<{ queryParams: string[]; locale: string }>;
}
export default async function SearchPage({
  searchParams,
  params,
}: SearchPageProps) {
  const parsedSearchParams = await searchParams;
  // const parsedParams = searchParamsCache.parse(parsedSearchParams);

  const { queryParams, locale } = await params;

  const parsedQueryParams = parseQueryParams(queryParams);
  // console.log("parsedQueryParams", parsedQueryParams);

  const locationMissing = !queryParams.some(
    (param) => param.startsWith("l-") && param.length > 2,
  );
  if (locationMissing) {
    return <Custom404 />;
  }
  const listings = await getAllListings(parsedQueryParams);
  return (
    <main className="min-h-screen bg-white">
      <SearchResults listings={listings} />
    </main>
  );
}
