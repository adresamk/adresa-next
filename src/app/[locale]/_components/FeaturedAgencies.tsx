import React from "react";
import { Bitcoin } from "lucide-react";
import ContentCarousel from "./ContentCarousel";
import prismadb from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function FeaturedAgencies() {
  const t = await getTranslations();
  const agencies = await prismadb.agency.findMany({
    take: 6,
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      users: {
        include: {
          listings: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
  return (
    <ContentCarousel
      icon={<Bitcoin className="h-7 w-7" />}
      title={t("home.sections.featuredAgencies")}
      items={agencies}
      renderItem={(agency) => (
        <div className="relative flex h-[190px] flex-col items-center justify-center rounded bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={agency.logoUrl || ""}
            alt={agency.name || ""}
            className="h-[86px] w-[112px]"
          />
          <h3 className="mt-2 text-center text-base">{agency.name}</h3>
          <Link
            href={`/agency/${agency.slug}/search`}
            className="relative z-30 mt-4 cursor-pointer text-center text-xs text-brand-light-blue"
          >
            <span>
              {agency.users.reduce(
                (acc: number, user: { listings: { id: string }[] }) =>
                  acc + user.listings.length,
                0,
              )}
            </span>
            <span className="ml-1">{t("common.search.results")}</span>
          </Link>

          <Link
            href={`/agency/${agency.slug}`}
            className="absolute inset-0 z-20"
          ></Link>
        </div>
      )}
      contentClasses="" // Example height
      carouselItemContainerClasses="min-w-[186px]"
      carouselItemClasses="h-full"
    />
  );
}
