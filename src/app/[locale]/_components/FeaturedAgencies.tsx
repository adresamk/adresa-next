import React, { Suspense } from "react";
import { Bitcoin, Gem } from "lucide-react";
import ContentCarousel from "./ContentCarousel";
import prismadb from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Agency, Listing, ListingStatus } from "@prisma/client";
import { UploadedImageData } from "@/types/listing.types";
import { AgencyWithListingsCount } from "@/types/agency.types";

export default async function FeaturedAgencies({
  featuredAgenciesPromise,
}: {
  featuredAgenciesPromise: Promise<AgencyWithListingsCount[]>;
}) {
  const [t, featuredAgencies] = await Promise.all([
    getTranslations(),
    featuredAgenciesPromise,
  ]);

  if (featuredAgencies.length === 0) {
    return null;
  }

  return (
    <ContentCarousel
      icon={<Gem className="h-7 w-7" />}
      title={t("home.sections.featuredAgencies")}
      items={featuredAgencies}
      renderItem={(agency: AgencyWithListingsCount) => {
        const logoUrl =
          (agency.logo as UploadedImageData)?.url ||
          "/assets/missing-image2.jpg";
        return (
          <div className="relative flex h-[190px] max-w-[186px] flex-col items-center justify-center rounded bg-white p-3 hover:shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={agency.name || ""}
              className="h-[86px] w-[112px]"
            />
            <h3 className="mt-2 break-words text-center text-base leading-4">
              {agency.name}
            </h3>
            {agency.listings.length > 0 && (
              <Link
                href={`/agency/${agency.slug}/search`}
                className="relative z-30 mt-auto cursor-pointer text-center text-xs text-brand-light-blue"
              >
                <span>{agency.listings.length}</span>

                <span className="ml-1">
                  {agency.listings.length === 0 && t("search.noResults.title")}
                  {agency.listings.length === 1 && t("common.words.listing")}
                  {agency.listings.length > 1 && t("common.words.listings")}
                </span>
              </Link>
            )}
            {agency.listings.length === 0 && (
              <span className="mt-auto cursor-pointer text-center text-xs lowercase text-brand-light-blue">
                {t("search.noResults.title")}
              </span>
            )}
            <Link
              href={`/agency/${agency.slug}`}
              className="absolute inset-0 z-20"
            ></Link>
          </div>
        );
      }}
      contentClasses="" // Example height
      carouselItemContainerClasses="min-w-[186px]"
      carouselItemClasses="h-full"
    />
  );
}
