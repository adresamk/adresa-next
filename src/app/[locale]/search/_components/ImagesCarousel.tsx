import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ImagesCarousel({
  images,
  height,
  width = 240,
}: {
  images: string[];
  height: number;
  width?: number;
}) {
  const t = useTranslations();
  const missingImage = "/assets/missing-image.jpg";

  return (
    <Carousel className="relative w-full max-w-xs">
      <CarouselContent>
        {images.map((imageSrc, index) => (
          <CarouselItem key={index} className={`h-[${height}px] w-full`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc || missingImage}
              // hack for now
              className="h-full rounded-tl-lg rounded-tr-lg object-cover"
              width={width}
              height={height}
              alt={t("common.listing.propertyImage", { index: index + 1 })}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-1 top-[50%]" />
      <CarouselNext className="absolute right-1 top-[50%]" />
    </Carousel>
  );
}
