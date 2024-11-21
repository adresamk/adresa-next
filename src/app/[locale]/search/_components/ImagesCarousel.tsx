import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function ImagesCarousel({ images }: { images: string[] }) {
  const missingImage = "/assets/missing-image.jpg";

  return (
    <Carousel className="relative w-full max-w-xs">
      <CarouselContent>
        {images.map((imageSrc, index) => (
          <CarouselItem key={index} className="h-[240px] w-full">
            <Image
              src={imageSrc || missingImage}
              // hack for now
              className="h-full rounded-tl-lg rounded-tr-lg object-cover"
              width={240}
              height={240}
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
