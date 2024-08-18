import Listings from "@/app/search/_components/Listings";
import SearchMap from "@/app/search/_components/SearchMap";
import Filters from "@/components/shared/filters/Filters";
import { Listing } from "@/global/types";
import { Button } from "../ui/button";
import Link from "next/link";

function AgencyBanner({ agency }: { agency?: any }) {
  return (
    <aside
      className={`flex justify-between items-center px-5 py-1 z-40 h-[80px]  text-white  bg-[${agency?.branding.primary}]`}
    >
      <div className="flex gap-2 ">
        <div className="px-3 py-2 bg-white w-[100px] h-[60px] flex items-center justify-center rounded">
          <img
            src="/assets/agency-logo.png"
            alt="Agencyt logo"
            width={55}
            height={42}
          />
        </div>
        <div>
          <p className="text-white/60">{agency.shortDescription}</p>
          <p className="text-2xl font-bold">{agency.name}</p>
        </div>
      </div>
      <Link href={`/agency/${agency.slug}`}>
        <Button
          variant={"outline"}
          className={`  bg-[${agency?.branding.primary}}]`}
        >
          Contact
        </Button>
      </Link>
    </aside>
  );
}

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
