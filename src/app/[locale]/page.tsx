import SuggestedProperties from "./_components/SuggestedProperties";
import Banner from "@/components/shared/Banner";
import SuggestedAgencies from "./_components/SuggestedAgencies";
import SearchHero from "./_components/SearchHero";
import { getUser } from "@/lib/auth";
import UserGreeting from "./_components/UserGreeting";
import LastSearches from "./_components/LastSearches";
import RecentlyViewedListings from "./_components/RecentlyViewedListings";

export default async function Home() {
  // works on the server side
  const user = await getUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <SearchHero />
      {/* Personalized content */}
      <section className="mb-3 mt-6 w-full max-w-7xl rounded-lg border border-slate-300 bg-slate-100">
        {user && (
          <>
            <UserGreeting />
          </>
        )}
        {/* Comes from LS, but needs to go to API for the newest listings count */}
        {/* en_recentSearches */}
        {/* en_latestSearchedGeographies */}
        <LastSearches />
        {/* Comes from LS or COOKIES, keep last search there */},
        {/* en_recentlyViewedProperties */}
        {/* Latest Searches ? */}
        <RecentlyViewedListings />
        <SuggestedProperties />
        <Banner />
        <SuggestedAgencies />
      </section>
    </main>
  );
}
