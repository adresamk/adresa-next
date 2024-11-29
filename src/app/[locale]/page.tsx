import LastOpenedProperties from "./_components/LastOpenedProperties";
import SuggestedProperties from "./_components/SuggestedProperties";
import Banner from "@/components/shared/Banner";
import SuggestedAgencies from "./_components/SuggestedAgencies";
import LastSearches from "./_components/LastSearches";
import SearchHero from "./_components/SearchHero";
import { getUser } from "@/lib/auth";
import UserGreeting from "./_components/UserGreeting";

export default async function Home() {
  // works on the server side
  const user = await getUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <SearchHero />
      {user && (
        <>
          <UserGreeting />
        </>
      )}
      <LastSearches />
      {/* Comes from LS or COOKIES, keep last search there */},
      {/* en_latestSearchedGeographies */}
      {/* en_recentSearches */}
      {/* en_recentlyViewedProperties */}
      {/* Latest Searches ? */}
      <LastOpenedProperties />
      <SuggestedProperties />
      <Banner />
      <SuggestedAgencies />
    </main>
  );
}
