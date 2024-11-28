import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function ImagesCarousel({
  images,
  height,
  width = 240
}: {
  images: string[];
  height: number;
  width?: number;
}) {
  const missingImage = "/assets/missing-image.jpg";

  return (
    <Carousel className="relative w-full max-w-xs">
      <CarouselContent>
        {images.map((imageSrc, index) => (
          <CarouselItem key={index} className={`h-[${height}px] w-full`}>
            <Image
              src={imageSrc || missingImage}
              // hack for now
              className="h-full rounded-tl-lg rounded-tr-lg object-cover"
              width={width}
              height={height}
              alt="Property first image"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-1 top-[50%]" />
      <CarouselNext className="absolute right-1 top-[50%]" />
    </Carousel>
  );
}
