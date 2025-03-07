import PropertyCard from "@/components/shared/PropertyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Listing } from "@prisma/client";
import ListingCard from "../../_components/ListingCard";
import ContentCarousel from "../../_components/ContentCarousel";
import { ScanEye, TrendingUp } from "lucide-react";

interface PopularAgencyPropertiesProps {
  title: string;
  listings: Listing[];
  bgColor?: string;
}

export default function PopularAgencyListings({
  title,
  listings,
  bgColor = "",
}: PopularAgencyPropertiesProps) {
  return (
    <ContentCarousel
      icon={<TrendingUp className="h-7 w-7" />}
      title={title}
      items={listings}
      renderItem={(listing) => <ListingCard listing={listing} />}
      contentClasses=""
      carouselItemContainerClasses="w-[256px] md:min-w-[336px] h-[280px]"
      carouselItemClasses="h-full"
    />
  );
}
