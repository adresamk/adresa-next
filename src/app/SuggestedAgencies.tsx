import PropertyCard from "@/components/shared/PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Building, SearchCheck, Star } from "lucide-react";
const agencies = [
  {
    id: 1,
    images: ["/assets/agency-logo.png"],
    name: "Martin Agency",
    propertiesManaged: 10,
  },
  {
    id: 2,
    images: ["/assets/agency-logo.png"],
    name: "Martin Agency",
    propertiesManaged: 10,
  },
  {
    id: 3,
    images: ["/assets/agency-logo.png"],
    name: "Martin Agency",
    propertiesManaged: 10,
  },
  {
    id: 4,
    images: ["/assets/agency-logo.png"],
    name: "Martin Agency",
    propertiesManaged: 10,
  },
  {
    id: 45,
    images: ["/assets/agency-logo.png"],
    name: "Martin Agency",
    propertiesManaged: 10,
  },
  {
    id: 5,
    images: ["/assets/agency-logo.png"],
    name: "Martin Agency",
    propertiesManaged: 10,
  },
  {
    id: 6,
    images: ["/assets/agency-logo.png"],
    name: "Martin Agency",
    propertiesManaged: 10,
  },
  {
    id: 7,
    images: ["/assets/agency-logo.png"],
    name: "Martin Agency",
    propertiesManaged: 10,
  },
];
export default function SuggestedAgencies() {
  return (
    <div className="flex flex-col gap-3 pb-3 pt-6">
      <h3 className="flex gap-4">
        <Building /> Suggested Agencies
      </h3>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="max-w-[900px]">
          {agencies.map((agency) => (
            <CarouselItem key={agency.id} className="basis-1/5">
              <div className=" max-w-[250px] max-h-[200px] shadow-md p-4 bg-white flex flex-col items-center justify-center rounded ">
                <img src={agency.images?.[0]} alt={agency.name} />
                <h4 className="mt-3">{agency.name}</h4>
                <p className="mt-1">
                  {agency.propertiesManaged} recommendations
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
