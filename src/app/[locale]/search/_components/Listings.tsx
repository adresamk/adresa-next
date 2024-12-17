import ListingsList from "./ListingsList";
import { Listing } from "@prisma/client";
import ModeChangeButton from "./ModeChangeButton";
import SearchBreadcrumbs from "./SearchBreadcrumbs";

export default function Listings({ listings }: { listings: Listing[] }) {
  return (
    <div className="order-1 border px-6 lg:w-3/5">
      <div className="flex items-center justify-between py-3">
        <SearchBreadcrumbs listings={listings} />
        <ModeChangeButton />
      </div>
      <ListingsList listings={listings} />
    </div>
  );
}
