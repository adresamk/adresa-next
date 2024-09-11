import LastOpenedProperties from "./LastOpenedProperties";
import SuggestedProperties from "./SuggestedProperties";
import Banner from "@/components/shared/Banner";
import SuggestedAgencies from "./SuggestedAgencies";
import LastSearches from "./LastSearches";
import SearchHero from "./SearchHero";
import { getUser } from "@/lib/auth";

export default async function Home() {
  const isLoggedIn = true;
  // works on the server side
  const user = await getUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <SearchHero />
      {isLoggedIn && <LastSearches />}
      <LastOpenedProperties />
      <SuggestedProperties />
      <Banner />
      <SuggestedAgencies />
    </main>
  );
}
