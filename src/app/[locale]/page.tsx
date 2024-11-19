import LastOpenedProperties from "./LastOpenedProperties";
import SuggestedProperties from "./SuggestedProperties";
import Banner from "@/components/shared/Banner";
import SuggestedAgencies from "./SuggestedAgencies";
import LastSearches from "./LastSearches";
import SearchHero from "./SearchHero";
import { getUser } from "@/lib/auth";
import UserGreeting from "./UserGreeting";

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
