import ListingCard from "@/components/shared/ListingCard";
import PropertyCard from "@/components/shared/PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import prismadb from "@/lib/db";
import { SearchCheck } from "lucide-react";

export default async function LastOpenedProperties() {
  const listings = await prismadb.listing.findMany({
    take: 6,
    orderBy: {
      id: "desc",
    },
    skip: Math.floor(Math.random() * 20), // Assuming there are at least 1000 listings
  });
  return (
    <div className="mx-auto flex flex-col gap-3 px-12 pb-3 pt-6">
      <h3 className="flex gap-4">
        <SearchCheck /> Last Opened Properties
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
