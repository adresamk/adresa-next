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
import { UploadedFileData } from "uploadthing/types";
import { UploadedImageData } from "@/types/listing.types";

export default function ImagesCarousel({
  images,
  height,
  width = 240,
}: {
  images: UploadedImageData[];
  height: number;
  width?: number;
}) {
  const t = useTranslations();
  const missingImage = "/assets/missing-image.jpg";

  return (
    <Carousel className="relative w-full">
      <CarouselContent className="">
        {images.map((image, index) => (
          <CarouselItem
            key={index}
            className={`w-full`}
            style={{
              height: `${height}px`,
              paddingLeft: "2px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image?.url || missingImage}
              loading={index === 0 ? "eager" : "lazy"}
              // hack for now
              className="h-full min-w-full rounded-tl-lg rounded-tr-lg object-cover"
              width={width}
              height={height}
              alt={t("common.listing.propertyImage", { index: index + 1 })}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-1 top-[50%] disabled:hidden" />
      <CarouselNext className="absolute right-1 top-[50%] disabled:hidden" />
    </Carousel>
  );
}
