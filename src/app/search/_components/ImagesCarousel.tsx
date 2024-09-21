import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
{
  /* <Image
src={listing.mainImage || missingImage}
// hack for now
className="h-full"
width={260}
height={240}
alt="Property first image"
/> */
}
export default function ImagesCarousel({
  images,
}: {
  images: string[];
}) {
  const missingImage = "/assets/missing-image.jpg";

  return (
    <Carousel className="w-full max-w-xs relative ">
      <CarouselContent>
        {images.map((imageSrc, index) => (
          <CarouselItem key={index} className="overflow-hidden">
            <Image
              src={imageSrc || missingImage}
              // hack for now
              className="h-full overflow-hidden  rounded-tr-lg rounded-tl-lg"
              width={240}
              height={160}
              alt="Property first image"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute top-[50%] left-1 " />
      <CarouselNext className="absolute top-[50%] right-1 " />
    </Carousel>
  );
}
