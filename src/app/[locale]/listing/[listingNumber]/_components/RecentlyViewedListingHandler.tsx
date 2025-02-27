"use client";

import { LocalStorageKeysOptions } from "@/lib/types";
import { readFromLocalStorage, writeToLocalStorage } from "@/lib/utils";
import { Listing } from "@prisma/client";
import { useLocale } from "next-intl";
import { useEffect } from "react";

type RecentlyViewedListing = {
  listingNumber: number;
  addedToRecentlyViewedDateTime: number;
};
interface RecentlyViewedListingHandlerProps {
  listing: Listing;
}
export default function RecentlyViewedListingHandler({
  listing,
}: RecentlyViewedListingHandlerProps) {
  const locale = useLocale();
  //   https://www.spitogatos.gr/n_api/v1/properties/by-ids?propertyIds[]=16003934
  // and hompage counts for the savedsearches to get count and new links
  // load then show
  useEffect(() => {
    console.log("RecentlyViewedListingHandler");
    const addToRecentlyViewed = () => {
      const recentlyViewedListings: RecentlyViewedListing[] =
        readFromLocalStorage("recentlyViewedListings") || [];

      const listingViewed = recentlyViewedListings.find(
        (l: RecentlyViewedListing) => l.listingNumber === listing.listingNumber,
      );
      if (listingViewed) {
        // Update the timestamp for this listing
        listingViewed.addedToRecentlyViewedDateTime = new Date().getTime();
        writeToLocalStorage("recentlyViewedListings", recentlyViewedListings);
        return;
      }

      const newRecentlyViewedListing: RecentlyViewedListing = {
        listingNumber: listing.listingNumber,
        addedToRecentlyViewedDateTime: new Date().getTime(),
      };

      recentlyViewedListings.push(newRecentlyViewedListing);
      writeToLocalStorage("recentlyViewedListings", recentlyViewedListings);
    };

    addToRecentlyViewed();
  }, [listing.listingNumber]);
  return null;
}
