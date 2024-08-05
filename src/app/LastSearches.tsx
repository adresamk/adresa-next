import PropertyCard from "@/components/shared/PropertyCard";
import SearchedCard from "@/components/shared/SearchedCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, SearchCheck } from "lucide-react";
const searches = [
  {
    id: 1,
    images: ["/assets/last-searched-examples.png"],
    filters: ["sakle", "apaertment", "third", "fourth"],
    results: 1228,
    newResults: 20,
    isSaved: false,
    location: "Skope, Centar",
  },
  {
    id: 2,
    images: ["/assets/last-searched-examples.png"],
    filters: ["sakle", "apaertment", "third"],
    results: 1228,
    newResults: 3,
    isSaved: true,
    location: "Skope, Centar",
  },
  {
    id: 3,
    images: ["/assets/last-searched-examples.png"],
    filters: ["sakle", "apaertment"],
    results: 1228,
    newResults: 20,
    isSaved: false,
    location: "Skope, Centar",
  },
  {
    id: 4,
    images: ["/assets/last-searched-examples.png"],
    filters: ["sakle", "apaertment", "third", "fourth"],
    results: 1228,
    newResults: 20,
    isSaved: false,
    location: "Skope, Centar",
  },
  {
    id: 5,
    images: ["/assets/last-searched-examples.png"],
    filters: ["sakle", "apaertment", "third", "fourth"],
    results: 1228,
    newResults: 20,
    isSaved: false,
    location: "Skope, Centar",
  },
];
export default function LastSearches() {
  return (
    <div className="flex flex-col gap-3 pb-3 pt-6">
      <h3 className="flex gap-4">
        <Heart /> Last Searches
      </h3>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="max-w-[900px]">
          {searches.map((search) => (
            <CarouselItem key={search.id} className="basis-1/3">
              <SearchedCard search={search} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
