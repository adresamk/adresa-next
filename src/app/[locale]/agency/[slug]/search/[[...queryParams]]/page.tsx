import Custom404 from "@/app/[locale]/search/[[...queryParams]]/_components/Custom404";
import { searchParamsCache } from "@/app/[locale]/searchParams";
import SearchResults from "@/components/shared/SearchResults";
import prismadb from "@/lib/db";
import { parseQueryParams } from "@/lib/filters";
import getAllListings from "@/server/actions/listing.actions";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";

interface SearchPageProps {
  searchParams: Promise<Record<string, string>>;
  params: Promise<{ slug: string; queryParams: string[]; locale: string }>;
}
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  return {
    title: `Објавени огласи од агенција ${slug} | Adresa.mk`,
    description: `Објавени огласи од агенција ${slug}`,
  };
};

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { queryParams, locale, slug } = await params;
  console.log("everything", queryParams, locale, slug);

  const agency = await prismadb.agency.findUnique({
    where: {
      slug: slug,
    },
  });
  if (!agency) {
    return <div>Agency not found</div>;
  }

  const parsedQueryParams = parseQueryParams(queryParams);

  const listings = await unstable_cache(
    async () => getAllListings(parsedQueryParams),
    ["listings", JSON.stringify(parsedQueryParams)],
    {
      revalidate: 60,
    },
  )();

  return (
    <main className="min-h-screen bg-white">
      <SearchResults listings={listings} agency={agency} />
    </main>
  );
}
