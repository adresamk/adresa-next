"use client";

import { ScanEye } from "lucide-react";
import ContentCarousel from "./ContentCarousel";
import RecentlyViewedListingCard from "./RecentlyViewedListingCard";
import { useEffect, useState } from "react";
import { readFromLocalStorage } from "@/lib/utils";
import { Listing } from "@prisma/client";
import { useTranslations } from "next-intl";
import { RecentlyViewedListing } from "@/lib/types";
import { getListingsByIdForRecentlyViewed } from "@/server/actions/listing.actions";

export default function RecentlyViewedListings() {
  const t = useTranslations();
  const [recentlyViewedListings, setRecentlyViewedListings] = useState<
    Listing[]
  >([]);
  // This should be replaced by a component before this that takes ID's (listingNumber) from LS
  // and then fetches the listings from the DB

  //effect description
  useEffect(() => {
    async function loadRecentlyViewedListings() {
      const rvl: RecentlyViewedListing[] = readFromLocalStorage(
        "recentlyViewedListings",
      );
      if (rvl) {
        const listings: Listing[] = await getListingsByIdForRecentlyViewed(
          rvl
            .toSorted(
              (a, b) =>
                b.addedToRecentlyViewedDateTime -
                a.addedToRecentlyViewedDateTime,
            )
            .map((item) => item.listingNumber),
        );
        setRecentlyViewedListings(listings);
      }
    }
    loadRecentlyViewedListings();
  }, []);

  if (recentlyViewedListings.length === 0) {
    return null;
  }
  return (
    <ContentCarousel
      icon={<ScanEye className="h-7 w-7" />}
      title={t("home.sections.lastOpenedListings.lastOpened")}
      items={recentlyViewedListings}
      renderItem={(listing) => <RecentlyViewedListingCard listing={listing} />}
      contentClasses=""
      carouselItemContainerClasses="w-[256px] md:min-w-[336px] h-[342px]"
      carouselItemClasses="h-full"
    />
  );
}
