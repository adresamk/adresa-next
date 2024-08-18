import SearchResults from "@/components/shared/SearchResults";
import { agencyExample, listings } from "@/global/data";

export default function SearchPage() {
  return (
    <main className="bg-white min-h-screen">
      <SearchResults listings={listings} />
    </main>
  );
}
