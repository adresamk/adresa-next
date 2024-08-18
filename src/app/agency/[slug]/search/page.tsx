import SearchResults from "@/components/shared/SearchResults";
import { agencyExample, listings } from "@/global/data";

const agency = agencyExample;
export default function SearchPage() {
  return (
    <main className="bg-white min-h-screen">
      <SearchResults listings={listings} agency={agency} />
    </main>
  );
}
