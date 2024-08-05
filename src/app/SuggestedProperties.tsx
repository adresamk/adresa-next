import PropertyCard from "@/components/shared/PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SearchCheck, Star } from "lucide-react";
const properties = [
  {
    id: 1,
    images: ["/assets/demo-property-bg.png"],
    type: "Apartment",
    area: "60m²",
    price: 200000,
    mode: "sale",
    tags: ["new", "featured"],
    location: "Skope, Centar",
    liked: true,
  },
  {
    id: 2,
    images: ["/assets/demo-property-bg.png"],
    type: "Apartment",
    area: "60m²",
    price: 200000,
    mode: "rent",
    tags: ["new"],
    location: "Skope, Centar",

    liked: false,
  },
  {
    id: 3,
    images: ["/assets/demo-property-bg.png"],
    type: "Apartment",
    area: "60m²",
    price: 200000,

    mode: "sale",
    tags: [],
    location: "Skope, Centar",

    liked: false,
  },
  {
    id: 4,
    images: ["/assets/demo-property-bg.png"],
    type: "Apartment",
    area: "60m²",
    price: 1_000,
    mode: "sale",
    tags: [],
    location: "Skope, Centar",

    liked: false,
  },
  {
    id: 5,
    images: ["/assets/demo-property-bg.png"],
    type: "Apartment",
    area: "60m²",
    price: 200000,
    mode: "sale",
    tags: [],
    location: "Skope, Centar",

    liked: false,
  },
  {
    id: 6,
    images: ["/assets/demo-property-bg.png"],
    type: "Apartment",
    area: "60m²",
    price: 200000,
    mode: "sale",
    tags: [],
    location: "Skope, Centar",

    liked: false,
  },
];
export default function SuggestedProperties() {
  return (
    <div className="flex flex-col gap-3 pb-3 pt-6">
      <h3 className="flex gap-4">
        <Star /> Suggested Properties
      </h3>
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
