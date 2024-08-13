import PropertyCard from "@/components/shared/PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { SearchCheck, Star } from "lucide-react";

export default function PopularAgencyProperties({
  title,
  properties,
  bgColor = "",
}: {
  title: string;
  properties: any[];
  bgColor?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 pb-3 pt-6", bgColor)}>
      <h3 className="flex gap-4 text-white text-xl my-3">{title}</h3>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="max-w-[900px]">
          {properties.map((property) => (
            <CarouselItem key={property.id} className="basis-1/3">
              <PropertyCard property={property} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
