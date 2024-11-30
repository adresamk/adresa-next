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
  cardClasses?: string; // Tailwind classes for card styling
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({
  icon,
  title,
  items,
  renderItem,
  contentClasses = "",
  cardClasses = "",
}) => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-14 pb-3 pt-6">
      <div className="flex items-center gap-4 text-xl font-bold">
        {icon} <h3>{title}</h3>
      </div>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent
          className={cn("-ml-0 grid grid-cols-3 gap-8", contentClasses)}
        >
          {items.map((item, index) => (
            <CarouselItem key={index} className={cn("w-fit pl-0", cardClasses)}>
              {renderItem(item)}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ContentCarousel;
