import { displayPrice } from "@/lib/utils";

import { displayPricePerSquare } from "@/lib/utils";
import { Listing } from "@prisma/client";

interface PriceDisplayProps {
  listing: Listing;
}
export default function PriceDisplay({ listing }: PriceDisplayProps) {
  return (
    <div className="flex w-fit flex-col items-center text-center text-xl">
      <div className="w-full bg-brand-dark-blue px-2 py-0.5 font-semibold text-white">
        {displayPrice(listing.price)}
      </div>
      <div className="w-full bg-blue-100 px-2 py-0.5 text-brand-light-blue">
        {displayPricePerSquare(listing.price, listing.area)}/m²
      </div>
      <div className="w-full">
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-full" src="/assets/price-shadow.png" alt="Cena" />
      </div>
    </div>
  );
}
