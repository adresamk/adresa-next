import React, { Suspense } from "react";
import { Crown, HistoryIcon } from "lucide-react";
import ContentCarousel from "./ContentCarousel";
import prismadb from "@/lib/db";
import RecentlyViewedListingCard from "./RecentlyViewedListingCard";
import { getTranslations } from "next-intl/server";
import { ListingStatus } from "@prisma/client";
// Add caching directive for the data fetch
async function getLatestListings() {
  return prismadb.listing.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      isPublished: true,
      isAvailable: true,
      status: ListingStatus.ACTIVE,
    },
  });
}
export default async function LatestListings() {
  const [listings, t] = await Promise.all([
    getLatestListings(),
    getTranslations(),
  ]);

  if (listings.length === 0) {
    return null;
  }

  return (
    <ContentCarousel
      icon={<HistoryIcon className="h-7 w-7" />}
      title={t("home.sections.latestListings")}
      items={listings}
      renderItem={(listing) => <RecentlyViewedListingCard listing={listing} />}
      contentClasses="" // Example height
      carouselItemContainerClasses="w-[256px] md:min-w-[336px] h-[342px]"
      carouselItemClasses="h-full"
    />
  );
}
