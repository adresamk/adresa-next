import PropertyCard from "@/components/shared/PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import prismadb from "@/lib/db";
import { Building, SearchCheck, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function SuggestedAgencies() {
  const t = await getTranslations();
  const agencies = await prismadb.agency.findMany({
    take: 6,
    select: {
      id: true,
      name: true,
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
          {agencies.map((agency) => (
            <CarouselItem
              key={agency.id}
              className="basis-1/4 pl-0 shadow-md transition hover:translate-y-[-2px]"
            >
              <div className="flex flex-col items-center justify-center rounded bg-white p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={agency.logoUrl || ""}
                  alt={agency.name || ""}
                  className="h-[86px] w-[112px]"
                />
                <p className="mt-2 text-center text-sm">{agency.name}</p>
                <p className="text-center text-sm text-gray-500">
                  {agency.users.reduce(
                    (acc, user) => acc + user.listings.length,
                    0,
                  )}{" "}
                  {t("common.search.results")}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
