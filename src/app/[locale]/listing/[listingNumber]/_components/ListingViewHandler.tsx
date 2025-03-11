"use client";

import { LocalStorageKeysOptions } from "@/lib/types";
import { readFromLocalStorage, writeToLocalStorage } from "@/lib/utils";
import { registerListingView } from "@/server/actions/listing.actions";
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
    const registerView = () => {
      registerListingView(listing.id);
    };

    registerView();
  }, [listing.listingNumber]);
  return null;
}
