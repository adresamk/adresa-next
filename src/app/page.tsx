import SearchHeroDisplay from "@/app/SearchHeroDisplay";
import LastOpenedProperties from "./LastOpenedProperties";
import SuggestedProperties from "./SuggestedProperties";
import Banner from "@/components/shared/Banner";
import SuggestedAgencies from "./SuggestedAgencies";
import LastSearches from "./LastSearches";

export default function Home() {
  const isLoggedIn = true;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <SearchHeroDisplay />
      {isLoggedIn && <LastSearches />}
      <LastOpenedProperties />
      <SuggestedProperties />
      <Banner />
      <SuggestedAgencies />
    </main>
  );
}
