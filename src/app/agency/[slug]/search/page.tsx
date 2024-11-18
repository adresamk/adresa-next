import { searchParamsCache } from "@/app/searchParams";
import SearchResults from "@/components/shared/SearchResults";
import prismadb from "@/lib/db";
import getAllListings from "@/server/actions/listing.actions";

interface SearchPageProps {
  searchParams: Promise<Record<string, string>>;
  params: Promise<{ slug: string }>;
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const searchParamsResult = await searchParams;
  const { slug } = await params;
  const agency = await prismadb.agency.findUnique({
    where: {
      slug: slug,
    },
  });
  console.log(agency);
  if (!agency) {
    return <div>Agency not found</div>;
  }
  const parsedParams = searchParamsCache.parse(searchParamsResult);
  console.log("Re-run server component", Math.random(), parsedParams);
  // @ts-ignore
  const listings = await getAllListings(parsedParams);
  return (
    <main className="min-h-screen bg-white">
      <SearchResults listings={listings} agency={agency} />
    </main>
  );
}
