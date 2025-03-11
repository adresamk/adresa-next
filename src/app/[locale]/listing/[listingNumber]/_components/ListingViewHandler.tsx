"use client";

import { LocalStorageKeysOptions } from "@/lib/types";
import { readFromLocalStorage, writeToLocalStorage } from "@/lib/utils";
import {
  incrementListingViewCount,
  registerListingView,
} from "@/server/actions/listing.actions";
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
    window && incrementListingViewCount(listing.id);
  }, [listing.listingNumber]);
  return null;
}
