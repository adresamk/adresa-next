import React, { Suspense } from "react";
import { Crown, ScanSearch } from "lucide-react";
import ContentCarousel from "./ContentCarousel";
import prismadb from "@/lib/db";
import RecentlyViewedListingCard from "./RecentlyViewedListingCard";
import { getTranslations } from "next-intl/server";
import { Agency, Listing, ListingStatus } from "@prisma/client";
import { AgencyWithListingsCount } from "@/types/agency.types";

export default async function FeaturedListings({
  featuredListingsPromise,
}: {
  featuredListingsPromise: Promise<Listing[]>;
}) {
  const [t, featuredListings] = await Promise.all([
    getTranslations(),
    featuredListingsPromise,
  ]);

  if (featuredListings.length === 0) {
    return null;
  }

  return (
    <ContentCarousel
      icon={<Crown className="h-7 w-7" />}
      title={t("home.sections.featuredListings")}
      items={featuredListings}
      renderItem={(listing) => <RecentlyViewedListingCard listing={listing} />}
      contentClasses="" // Example height
      carouselItemContainerClasses="w-[256px] md:min-w-[336px] h-[342px]"
      carouselItemClasses="h-full"
    />
  );
}
