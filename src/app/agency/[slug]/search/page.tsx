import { searchParamsCache } from "@/app/searchParams";
import SearchResults from "@/components/shared/SearchResults";
import prismadb from "@/lib/db";
import getAllListings from "@/requests/getAllListings";

interface SearchPageProps {
  searchParams: Record<string, string>;
  params: { slug: string };
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const agency = await prismadb.agency.findUnique({
    where: {
      slug: params.slug,
    },
  });
  console.log(agency);
  if (!agency) {
    return <div>Agency not found</div>;
  }
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
