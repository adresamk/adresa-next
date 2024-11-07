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
export default async function SuggestedAgencies() {
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
        <Building /> Suggested Agencies
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
                <img
                  src={agency.logoUrl || ""}
                  alt={agency.name || ""}
                  className="h-[86px] w-[112px]"
                />
                <h4 className="mt-3">{agency.name}</h4>
                <p className="mt-1 text-sm text-slate-600">
                  {agency.users[0].listings.length} recommendations
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
