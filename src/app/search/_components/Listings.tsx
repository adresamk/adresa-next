import { Button } from "@/components/ui/button";
import { Repeat } from "lucide-react";
import ListingsList from "./ListingsList";
import { Listing } from "@prisma/client";
import ModeChangeButton from "./ModeChangeButton";
import Breadcrumbs from "./Breadcrumbs";

export default function Listings({
  listings,
}: {
  listings: Listing[];
}) {
  return (
    <div className="lg:w-3/5 border px-6 order-1">
      <div className="flex items-center justify-between py-3">
        <Breadcrumbs />
        <ModeChangeButton />
      </div>

      <ListingsList listings={listings} />
    </div>
  );
}
