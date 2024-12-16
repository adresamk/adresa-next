import React from "react";
import { Bitcoin } from "lucide-react";
import ContentCarousel from "./ContentCarousel";
import prismadb from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Agency } from "@prisma/client";
import { UploadedImageData } from "@/types/listing.types";

type AgencyWithListings = Agency & {
  listings: { id: string }[];
};

export default async function FeaturedAgencies() {
  const t = await getTranslations();
  const agencies = await prismadb.agency.findMany({
    take: 6,
    include: {
      listings: {
        select: {
          id: true, // You can select any field, but we only need the count
        },
      },
    },
  });

  return (
    <ContentCarousel
      icon={<Bitcoin className="h-7 w-7" />}
      title={t("home.sections.featuredAgencies")}
      items={agencies}
      renderItem={(agency: AgencyWithListings) => {
        const logoUrl =
          (agency.logo as UploadedImageData)?.url ||
          "/assets/missing-image2.jpg";
        return (
          <div className="relative flex h-[190px] flex-col items-center justify-center rounded bg-white p-4 hover:shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={agency.name || ""}
              className="h-[86px] w-[112px]"
            />
            <h3 className="mt-2 text-center text-base">{agency.name}</h3>
            <Link
              href={`/agency/${agency.slug}/search`}
              className="relative z-30 mt-4 cursor-pointer text-center text-xs text-brand-light-blue"
            >
              <span>{agency.listings.length}</span>
              <span className="ml-1">
                {agency.listings.length === 0 && t("common.search.noResults")}
                {agency.listings.length === 1 && t("common.search.result")}
                {agency.listings.length > 1 && t("common.search.results")}
              </span>
            </Link>

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
