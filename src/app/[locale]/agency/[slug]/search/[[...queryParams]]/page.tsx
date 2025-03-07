import SearchResults from "@/components/shared/SearchResults";
import prismadb from "@/lib/db";
import { parseQueryParams } from "@/lib/filters";
import { getCurrentUser } from "@/lib/sessions";
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
  const { user } = await getCurrentUser();

  const agency = await prismadb.agency.findUnique({
    where: {
      slug: slug,
    },
  });
  if (!agency) {
    return <div>Agency not found</div>;
  }

  const ttIsMissing = !slug.includes("tt-");
  const parsedQueryParams = parseQueryParams(queryParams);
  console.log("pqp4", { parsedQueryParams });

  const listings = await unstable_cache(
    async () => {
      const listings = await getAllListings({
        ...parsedQueryParams,
        transactionType: ttIsMissing
          ? undefined
          : parsedQueryParams.transactionType,
      });
      return listings.filter((listing) => listing.agencyId === agency.id);
    },
    ["listings-for-" + slug, JSON.stringify(parsedQueryParams)],
    {
      revalidate: false,
    },
  )();

  // After getting cached listings, fetch favorites for the current user
  const userFavorites = await prismadb.favorite.findMany({
    where: {
      userId: user?.id, // Assuming you have session data
      listingId: {
        in: listings.map((listing) => listing.id),
      },
    },
    select: {
      listingId: true,
    },
  });

  // Create a Set for O(1) lookup
  const favoriteSet = new Set(userFavorites.map((fav) => fav.listingId));

  // Add isLiked to listings
  const listingsWithLikeStatus = listings.map((listing) => ({
    ...listing,
    isLiked: favoriteSet.has(listing.id),
  }));

  return (
    <main className="min-h-screen bg-white">
      <SearchResults listings={listingsWithLikeStatus} agency={agency} />
    </main>
  );
}
