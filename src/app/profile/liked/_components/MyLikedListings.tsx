"use client";
import ListingCard from "@/components/shared/ListingCard";
import { cn } from "@/lib/utils";
import { Listing } from "@prisma/client";
import { use, useState } from "react";

export default function MyLikedListings({
  listings,
}: {
  listings: Listing[];
}) {
  const [activeFilter, setActiveFilter] = useState("sale");
  return (
    <div>
      <div className="flex justify-between mb-2">
        <div className="flex gap-2">
          <div
            onClick={() => setActiveFilter("sale")}
            className={cn(
              "bg-white cursor-pointer pointer text-brand-light-blue rounded-md capitalize border border-brand-light-blue px-5 py-1",
              activeFilter === "sale" &&
                "bg-brand-light-blue text-white"
            )}
          >
            sale
          </div>
          <div
            onClick={() => setActiveFilter("rent")}
            className={cn(
              "bg-white cursor-pointer text-brand-light-blue rounded-md capitalize border border-brand-light-blue px-5 py-1",
              activeFilter === "rent" &&
                "bg-brand-light-blue text-white"
            )}
          >
            rent
          </div>
          <div
            onClick={() => setActiveFilter("all")}
            className={cn(
              "bg-white cursor-pointer text-brand-light-blue rounded-md capitalize border border-brand-light-blue px-5 py-1",
              activeFilter === "all" &&
                "bg-brand-light-blue text-white"
            )}
          >
            all
          </div>
        </div>
        <div>Sort</div>
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
            <ListingCard listing={listing} />
          ))}
      </div>
      {/* <pre>{JSON.stringify(listings, null, 2)}</pre> */}
    </div>
  );
}
