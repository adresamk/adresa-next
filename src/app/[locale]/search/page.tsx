import SearchResults from "@/components/shared/SearchResults";
import { searchParamsCache } from "../searchParams";
import getAllListings from "@/server/actions/listing.actions";

interface SearchPageProps {
  searchParams: Promise<Record<string, string>>;
}
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const parsedSearchParams = await searchParams;
  const parsedParams = searchParamsCache.parse(parsedSearchParams);

  // console.log("Re-run server component", Math.random(), parsedParams);
  // @ts-ignore
  const listings = await getAllListings(parsedParams);
  // const { user } = await getCurrentUser();

  // If user is logged in, fetch their favorites and mark listings accordingly
  // let listingsWithFavorites = listings;
  // if (user) {
  //   const favorites = await prismadb.favorite.findMany({
  //     where: {
  //       userId: user.id,
  //     },
  //     select: {
  //       listingId: true,
  //     },
  //   });

  //   const favoriteIds = new Set(favorites.map((fav) => fav.listingId));

  //   listingsWithFavorites = listings.map((listing) => ({
  //     ...listing,
  //     isFavorited: favoriteIds.has(listing.id),
  //   }));
  // }

  return (
    <main className="min-h-screen bg-white">
      <SearchResults listings={listings} />
    </main>
  );
}
