import { Listing } from "@prisma/client";
import { useTranslations } from "next-intl";

import ListingsListTitle from "./ListingsListTitle";
import ListingsSearchShowcase from "./ListingsSearchShowcase";
import SortingFilter from "@/components/shared/filters/primary/SortingFIlter";

interface ListingListProps {
  listings: Listing[];
}
export default function ListingsList({ listings }: ListingListProps) {
  const t = useTranslations();
  const loweredPriceListings = listings.filter(
    (listing) =>
      listing.price &&
      listing.previousPrice &&
      listing.price < listing.previousPrice,
  ).length;

  return (
    <div>
      <ListingsListTitle />
      <div className="my-2 flex items-center justify-between">
        <div className="text-sm">
          <span>
            {listings.length} {t("search.results")}
          </span>{" "}
          {loweredPriceListings > 0 && (
            <span className="cursor-pointer text-brand-light-blue">
              {"|"} {loweredPriceListings} {t("search.loweredPriceResults")}
            </span>
          )}
        </div>
        <SortingFilter />
      </div>
      <ul className="">
        {listings.map((listing: Listing) => (
          <ListingsSearchShowcase key={listing.id} listing={listing} />
        ))}
      </ul>
    </div>
  );
}
