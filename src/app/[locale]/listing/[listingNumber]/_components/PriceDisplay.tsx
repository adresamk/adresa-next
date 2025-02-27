import { displayPrice } from "@/lib/utils";

import { displayPricePerSquare } from "@/lib/utils";
import { Listing, PropertyTransactionType } from "@prisma/client";
import { useTranslations } from "next-intl";

interface PriceDisplayProps {
  listing: Listing;
}
export default function PriceDisplay({ listing }: PriceDisplayProps) {
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
