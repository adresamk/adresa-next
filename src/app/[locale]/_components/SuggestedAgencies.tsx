import PropertyCard from "@/components/shared/PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import prismadb from "@/lib/db";
import { UploadedImageData } from "@/types/listing.types";
import { Building, SearchCheck, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function SuggestedAgencies() {
  const t = await getTranslations();
  const agencies = await prismadb.agency.findMany({
    take: 6,
    select: {
      slug: true,
      id: true,
      name: true,
      logo: true,
      _count: {
        select: {
          listings: true,
        },
      },
    },
  });

  console.log("agencies", agencies);

  return (
    <div className="mx-auto flex flex-col gap-3 px-12 pb-3 pt-6">
      <h3 className="flex gap-4">
        <Building /> {t("home.sections.agencies")}
      </h3>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="flex max-w-[900px] gap-2 p-2 px-3">
          {agencies.map((agency) => {
            // console.log(agency.listings[0]);
            const logoUrl =
              (agency.logo as UploadedImageData)?.url ||
              "/assets/missing-image2.jpg";
            return (
              <CarouselItem
                key={agency.id}
                className="basis-1/4 pl-0 shadow-md transition hover:translate-y-[-2px]"
              >
                <div className="flex h-full flex-col items-center justify-center rounded bg-white p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt={agency.name || ""}
                    className="h-[86px] w-[112px]"
                  />
                  <p className="mt-2 text-center text-sm">{agency.name}</p>
                  <Link
                    target="_blank"
                    href={`/agency/${agency.slug}/search`}
                    className="relative z-30 mt-auto cursor-pointer text-center text-xs text-brand-light-blue"
                  >
                    <p className="text-center text-sm">
                      {agency._count.listings} {t("common.search.results")}
                    </p>
                  </Link>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
