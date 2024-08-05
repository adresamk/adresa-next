import SearchHeroDisplay from "@/app/SearchHeroDisplay";
import LastOpenedProperties from "./LastOpenedProperties";
import SuggestedProperties from "./SuggestedProperties";
import Banner from "@/components/shared/Banner";
import SuggestedAgencies from "./SuggestedAgencies";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <SearchHeroDisplay />
      <LastOpenedProperties />
      <SuggestedProperties />
      <Banner />
      <SuggestedAgencies />
    </main>
  );
}
