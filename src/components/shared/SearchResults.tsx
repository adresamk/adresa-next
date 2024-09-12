import Listings from "@/app/search/_components/Listings";
import SearchMap from "@/app/search/_components/SearchMap";
import Filters from "@/components/shared/filters/Filters";
import { Listing } from "@prisma/client";
import AgencyBanner from "./AgencyBanner";

export default function SearchResults({
  listings,
  agency,
}: {
  listings: Listing[];
  agency?: any;
}) {
  return (
    <div className="w-full ">
      {agency && <AgencyBanner agency={agency} />}
      <Filters />
      <section className="flex flex-col-reverse lg:flex-row relative z-0 w-full">
        <Listings listings={listings} />
        <SearchMap listings={listings} />
      </section>
    </div>
  );
}
