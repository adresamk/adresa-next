import { displayPrice, displayPriceMonthly } from "@/lib/utils";

import { displayPricePerSquare } from "@/lib/utils";
import { Listing, PropertyTransactionType } from "@prisma/client";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface PriceDisplayProps {
  listing: Listing;
}
export default function PriceDisplay({ listing }: PriceDisplayProps) {
  return <PriceDisplayFromDesign listing={listing} />;
}

function PriceDisplayFromDesign({ listing }: { listing: Listing }) {
  const t = useTranslations("");
  return (
    <div className="flex flex-wrap items-end">
      {listing.transactionType === "sale" && (
        <div className="mb-1.5 flex items-center">
          <p className="relative text-4xl font-bold leading-4 tracking-tighter">
            {displayPrice(listing.price, undefined, t)}
          </p>
          {listing.previousPrice &&
            listing.previousPrice > (listing.price ?? 0) && (
              <div className="flex items-center text-3xl font-semibold">
                <ArrowDown
                  className="lowered-price ml-1 mr-0.5 h-5 w-5"
                  stroke="green"
                />
                <span className="text-gray-400 line-through">
                  {displayPrice(listing.previousPrice, undefined, t)}
                </span>
              </div>
            )}

          <p className="ml-3 text-2xl font-semibold text-brand-black-muted">
            {!!listing.price &&
              listing.price > 20 &&
              displayPricePerSquare(listing.price, listing.area)}
          </p>
        </div>
      )}
      {listing.transactionType === "rent" && (
        <div className="mb-1.5 flex items-center text-4xl font-bold">
          <p className="relative text-xl font-bold leading-4 tracking-tighter">
            {displayPriceMonthly(
              listing.price,
              "EUR",
              t("mortgageCalculator.month"),
            )}
          </p>
        </div>
      )}
    </div>
  );
}
function AlternativePriceDisplay({ listing }: { listing: Listing }) {
  const t = useTranslations("");
  return (
    <div className="flex w-fit flex-col items-center text-center">
      <div className="w-full bg-brand-dark-blue px-2 py-0.5 text-2xl font-semibold text-white">
        {displayPrice(listing.price, "EUR", t)}
      </div>
      {listing.transactionType === PropertyTransactionType.sale && (
        <div className="w-full bg-blue-100 px-2 py-0.5 text-lg text-brand-light-blue">
          {displayPricePerSquare(listing.price, listing.area, "EUR") ||
            t("common.words.missingValue")}
        </div>
      )}

      {listing.transactionType === PropertyTransactionType.rent && (
        <div className="w-full bg-blue-100 px-2 py-0.5 text-lg text-brand-light-blue">
          {t("common.words.monthly")}
        </div>
      )}
      <div className="w-full">
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-full" src="/assets/price-shadow.png" alt="Cena" />
      </div>
    </div>
  );
}
