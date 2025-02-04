import React from "react";
import { Crown, ScanSearch } from "lucide-react";
import ContentCarousel from "./ContentCarousel";
import prismadb from "@/lib/db";
import RecentlyViewedListingCard from "./RecentlyViewedListingCard";
import { getTranslations } from "next-intl/server";
import { ListingStatus } from "@prisma/client";

export default async function FeaturedListings() {
  const t = await getTranslations();
  const listings = await prismadb.listing.findMany({
    take: 5,
    where: {
      isPaidPromo: true,
      isPublished: true,
      isAvailable: true,
      status: ListingStatus.ACTIVE,
    },
  });

  if (listings.length === 0) {
    return null;
  }

  return (
    <ContentCarousel
      icon={<Crown className="h-7 w-7" />}
      title={t("home.sections.featuredListings")}
      items={listings}
      renderItem={(listing) => <RecentlyViewedListingCard listing={listing} />}
      contentClasses="" // Example height
      carouselItemContainerClasses="w-[256px] md:min-w-[336px] h-[342px]"
      carouselItemClasses="h-full"
    />
  );
}
