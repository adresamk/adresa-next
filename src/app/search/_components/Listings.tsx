import { Button } from "@/components/ui/button";
import { Repeat } from "lucide-react";
import ListingsList from "./ListingsList";
import { Listing } from "@/global/types";

export default function Listings({
  listings,
}: {
  listings: Listing[];
}) {
  return (
    <div className="lg:w-3/5 border px-6 order-1">
      <div className="flex items-center justify-between py-3">
        <div className="text-sm">
          <span>Prodazba na stanovi</span> {">"}{" "}
          <span>Skopje, Centar</span>
        </div>
        <Button
          variant={"outline"}
          size={"sm"}
          className="border-brand-light-blue text-brand-light-blue hover:text-brand-dark-blue"
        >
          {" "}
          <Repeat className="mr-2" />{" "}
          <span className="text-lg">Rent</span>
        </Button>
      </div>

      <ListingsList
        title="Stanovi: Skopje, Centar"
        listings={listings}
      />
    </div>
  );
}
