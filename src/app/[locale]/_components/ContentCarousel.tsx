import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ContentCarouselProps {
  icon: React.ReactNode;
  title: string;
  items: Array<any>; // Define a more specific type based on your item structure
  renderItem: (item: any) => React.ReactNode; // Function to render each item
  contentClasses?: string; // Tailwind classes for content styling
  carouselItemClasses?: string; // Tailwind classes for card styling
  carouselItemContainerClasses?: string; // Tailwind classes for card styling
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({
  icon,
  title,
  items,
  renderItem,
  contentClasses = "",
  carouselItemClasses = "",
  carouselItemContainerClasses = "",
}) => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-1.5 px-14 pb-3 pt-6">
      <div className="flex items-center gap-4 text-xl font-bold">
        {icon} <h3>{title}</h3>
      </div>
      <Carousel opts={{ align: "start" }} className="shadcn-carousel">
        <CarouselContent className={cn("", contentClasses)}>
          {items.map((item, index) => (
            <div key={index} className={cn("", carouselItemContainerClasses)}>
              <CarouselItem className={cn("", carouselItemClasses)}>
                {renderItem(item)}
              </CarouselItem>
            </div>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-black" />
        <CarouselNext className="text-black" />
      </Carousel>
    </div>
  );
};

export default ContentCarousel;
