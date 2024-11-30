import ListingCard from "@/app/[locale]/_components/ListingCard";
import PropertyCard from "@/components/shared/PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import prismadb from "@/lib/db";
import { SearchCheck, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function SuggestedProperties() {
  const t = await getTranslations();
  const listings = await prismadb.listing.findMany({
    take: 6,
  });
  return (
    <div className="mx-auto flex flex-col gap-3 px-12 pb-3 pt-6">
      <h3 className="flex gap-4">
        <Star /> {t("home.sections.suggested")}
      </h3>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="max-w-[900px]">
          {listings.map((listing) => (
            <CarouselItem key={listing.id} className="basis-1/3">
              <ListingCard listing={listing} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
