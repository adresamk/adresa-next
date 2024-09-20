import { Listing } from "@prisma/client";

import {
  AirVentIcon,
  AlarmCheck,
  BrickWall,
  DoorClosed,
  DoorOpen,
  Fence,
  House,
  ShowerHead,
} from "lucide-react";
import ListingsListTitle from "./ListingsListTitle";
import ListingsSearchShowcase from "./ListingsSearchShowcase";
import SortingFilter from "@/components/shared/filters/primary/SortingFIlter";

const icons: { [key: string]: JSX.Element } = {
  bathroom: <ShowerHead width={16} height={16} />,
  ac: <AirVentIcon width={16} height={16} />,
  garage: <House width={16} height={16} />,
  elevator: <DoorClosed />,
  alart: <AlarmCheck />,
  protectionDoor: <DoorOpen />,
  spajz: <DoorOpen />,
  terace: <Fence />,
  facade: <BrickWall />,
};

interface ListingListProps {
  listings: Listing[];
}
export default function ListingsList({ listings }: ListingListProps) {
  const loweredPriceListings = 2;

  return (
    <div>
      <ListingsListTitle />
      <div className="flex items-center justify-between my-2.5">
        <div className="text-sm">
          <span>{listings.length} results</span> {"|"}{" "}
          {loweredPriceListings > 0 && (
            <span className="text-brand-light-blue cursor-pointer">
              {loweredPriceListings} results with lowered price
            </span>
          )}
        </div>
        <div>
          <SortingFilter />
        </div>
      </div>
      <ul className="">
        {listings.map((listing: Listing) => (
          <ListingsSearchShowcase
            key={listing.id}
            listing={listing}
          />
        ))}
      </ul>
    </div>
  );
}
