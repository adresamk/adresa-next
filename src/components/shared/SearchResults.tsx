import Filters from "@/components/shared/filters/Filters";
import { Listing, Agency } from "@prisma/client";
import AgencyBanner from "./AgencyBanner";
import Listings from "@/app/[locale]/search/[[...queryParams]]/_components/Listings";
import SearchMapClient from "@/app/[locale]/search/[[...queryParams]]/_components/SearchMapClient";

export default function SearchResults({
  listings,
  agency,
}: {
  listings: Listing[];
  agency?: Agency;
}) {
  return (
    <div className="w-full">
      {agency && <AgencyBanner agency={agency} />}
      <Filters listings={listings} />
      <section className="relative z-0 flex w-full flex-col lg:flex-row-reverse">
        <SearchMapClient listings={listings} />
        <Listings listings={listings} />
      </section>
    </div>
  );
}
