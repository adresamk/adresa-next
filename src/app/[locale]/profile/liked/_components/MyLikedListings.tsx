"use client";
import ListingCard from "@/app/[locale]/_components/ListingCard";
import { cn } from "@/lib/utils";
import { Listing } from "@prisma/client";
import { useTranslations } from "next-intl";
import { use, useState } from "react";

export default function MyLikedListings({ listings }: { listings: Listing[] }) {
  const [activeFilter, setActiveFilter] = useState("sale");
  const t = useTranslations();
  console.log("listings343", listings);
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <div className="flex gap-2">
          <div
            onClick={() => setActiveFilter("sale")}
            className={cn(
              "pointer cursor-pointer rounded-md border border-brand-light-blue bg-white px-5 py-1 capitalize text-brand-light-blue",
              activeFilter === "sale" && "bg-brand-light-blue text-white",
            )}
          >
            {t("search.filters.mode.sale")}
          </div>
          <div
            onClick={() => setActiveFilter("rent")}
            className={cn(
              "cursor-pointer rounded-md border border-brand-light-blue bg-white px-5 py-1 capitalize text-brand-light-blue",
              activeFilter === "rent" && "bg-brand-light-blue text-white",
            )}
          >
            {t("search.filters.mode.rent")}
          </div>
          <div
            onClick={() => setActiveFilter("all")}
            className={cn(
              "cursor-pointer rounded-md border border-brand-light-blue bg-white px-5 py-1 capitalize text-brand-light-blue",
              activeFilter === "all" && "bg-brand-light-blue text-white",
            )}
          >
            {t("search.filters.mode.all")}
          </div>
        </div>
        <div>{t("user.profile.likedListings.sort")} </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {listings
          .filter((listing) => {
            if (activeFilter === "sale") {
              return listing.transactionType === "sale";
            } else if (activeFilter === "rent") {
              return listing.transactionType === "rent";
            } else {
              return true;
            }
          })
          .map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
      </div>
      {/* <pre>{JSON.stringify(listings, null, 2)}</pre> */}
    </div>
  );
}
