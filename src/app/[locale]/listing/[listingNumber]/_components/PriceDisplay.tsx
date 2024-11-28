import { SerializedListing } from "@/lib/types";
import { displayPrice } from "@/lib/utils";

import { displayPricePerSquare } from "@/lib/utils";
import { Listing } from "@prisma/client";

interface PriceDisplayProps {
  listing: SerializedListing;
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

let a = (
  <div className="central-feature-wrapper">
    <div className="central-feature">
      <span data-value="63.000">
        <i>63.000&nbsp;€</i>
      </span>
      <div className="price-shadow">
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/price-shadow.png" alt="Cena" />
      </div>
    </div>
    <div className="price-by-surface">
      <span>
        1.750 €/m<sup>2</sup>
      </span>
    </div>
  </div>
);
