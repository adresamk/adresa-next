"use client";
import { ImageIcon, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { Modal } from "@/components/shared/Modal";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalizeString, displayArea, displayPrice } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useTranslations } from "next-intl";
import { Listing } from "@prisma/client";
import { UploadedImageData } from "@/types/listing.types";

export default function ListingImages({
  listing,
  currentMunicipalityLabel,
  currentPlaceLabel,
}: {
  listing: Listing;
  currentMunicipalityLabel: string;
  currentPlaceLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openTab, setOpenTab] = useState("overview");
  const [openImageIndex, setOpenImageIndex] = useState<null | number>(null);
  const t = useTranslations();
  function onClose() {
    setOpenTab("overview");
    setOpenImageIndex(null);
    setIsOpen(false);
  }
  const images = (listing.images || []) as UploadedImageData[];

  function handlePhotoSelection(idx: number) {
    if (idx > images.length - 1 || idx < 0) {
      console.error("Invalid index");
      return;
    }
    setOpenTab("singleAtATime");
    setOpenImageIndex(idx);
  }

  return (
    <>
      <Modal
        title={t("listing.listingImages.modalTitle", {
          type: capitalizeString(t(`common.property.type.${listing.type}`)),
          area: listing.area,
        })}
        description={t("listing.listingImages.modalDescription", {
          place: currentPlaceLabel,
          municipality: currentMunicipalityLabel,
          price: displayPrice(listing.price, undefined, t),
        })}
        isOpen={isOpen}
        onClose={onClose}
        className="h-full max-w-[97vw] px-1.5 sm:px-6"
      >
        <div className="h-[calc(100vh_-_150px)] max-h-[97vh] overflow-y-scroll">
          <Tabs value={openTab} className="h-[100%]">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger
                value="overview"
                onClick={() => setOpenTab("overview")}
              >
                <LayoutGrid />
              </TabsTrigger>
              <TabsTrigger
                value="singleAtATime"
                onClick={() => setOpenTab("singleAtATime")}
              >
                <ImageIcon />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="h-full">
              <div className="photoGridContainer flex flex-grow flex-wrap overflow-y-hidden">
                {images.map((image, idx) => {
                  const imageUrl = image?.url || "/assets/missing-image2.jpg";
                  return (
                    <div
                      key={idx}
                      onClick={() => handlePhotoSelection(idx)}
                      className="mb-3 h-fit w-full max-w-full flex-shrink-0 px-1.5 sm:w-1/2 sm:flex-auto sm:flex-shrink sm:flex-grow md:w-1/3"
                    >
                      <figure className="h-[25vh] max-h-[300px] min-h-[100px] cursor-pointer overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          // onLoad={(
                          //   e: React.SyntheticEvent<HTMLImageElement>,
                          // ) => {
                          //   const img = e.target as HTMLImageElement;
                          //   img.naturalWidth;
                          //   console.log("image loaded");
                          // }}
                          src={imageUrl}
                          alt={t("listing.listingImages.photo", {
                            index: idx + 1,
                          })}
                          width={800}
                          height={533}
                          className="h-full w-full object-cover object-center"
                          loading="lazy"
                        />
                      </figure>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="singleAtATime" className="h-[89%]">
              <div className="relative h-full max-h-full w-full px-0 sm:px-12">
                <Carousel
                  className="relative h-full"
                  opts={{
                    align: "start",
                    startIndex: openImageIndex || 0,
                  }}
                >
                  <CarouselContent
                    className="h-full max-w-full gap-x-4"
                    outerDivWrapperClassName="h-full"
                  >
                    {images.map((image, idx) => (
                      <CarouselItem
                        key={idx}
                        className="flex h-full max-h-[75vh] basis-full items-center justify-center pl-0"
                      >
                        <figure className="h-full max-w-fit">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image?.url || "/assets/missing-image2.jpg"}
                            alt={t("listing.listingImages.photo", {
                              index: idx + 1,
                            })}
                            width={800}
                            height={533}
                            className="h-full object-contain object-center"
                            loading="lazy"
                          />
                        </figure>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-0.5 top-[50%] ml-1 border-slate-400 disabled:hidden sm:static sm:hidden" />
                  <CarouselNext className="absolute right-0.5 top-[50%] mr-1 border-slate-400 disabled:hidden sm:static sm:hidden" />
                  <CarouselPrevious className="ml-2 hidden border-slate-400 sm:flex" />
                  <CarouselNext className="mr-2 hidden border-slate-400 sm:flex" />
                </Carousel>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Modal>
      <div
        className="relative overflow-hidden rounded-xl"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <div className="z-0 block overflow-y-hidden md:h-[calc(-64px_+_54vh)]">
          <div className="relative float-left box-border aspect-video h-full min-h-[150px] w-full max-w-full px-0.5 md:aspect-auto md:min-h-[300px] md:w-1/2">
            <div className="relative z-0 h-full w-full cursor-pointer text-center hover:opacity-85">
              <Image
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-center"
                src={
                  (images[0] && images[0]?.url) || "/assets/missing-image2.jpg"
                }
                alt="1"
                height={300}
                width={300}
              />
            </div>
          </div>

          <div className="relative float-left mb-1.5 box-border hidden h-[calc(-34px_+_27vh)] min-h-[150px] w-1/4 max-w-full px-0.5 md:block">
            {images[1] && (
              <div className="relative z-0 h-full w-full cursor-pointer text-center hover:opacity-85">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  src={images[1]?.url || "/assets/missing-image2.jpg"}
                  alt="2"
                  height={150}
                  width={150}
                />
              </div>
            )}
          </div>
          <div className="relative float-left mb-1.5 box-border hidden h-[calc(-34px_+_27vh)] min-h-[150px] w-1/4 max-w-full px-0.5 md:block">
            {images[2] && (
              <div className="relative z-0 h-full w-full cursor-pointer text-center hover:opacity-85">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  src={images[2]?.url || "/assets/missing-image2.jpg"}
                  alt="3"
                  height={150}
                  width={150}
                />
              </div>
            )}
          </div>
          <div className="relative float-left mb-1.5 box-border hidden h-[calc(-34px_+_27vh)] min-h-[150px] w-1/4 max-w-full px-0.5 md:block">
            {images[3] && (
              <div className="relative z-0 h-full w-full cursor-pointer text-center hover:opacity-85">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  src={images[3]?.url || "/assets/missing-image2.jpg"}
                  alt="4"
                  height={150}
                  width={150}
                />
              </div>
            )}
          </div>
          <div className="relative float-left mb-1.5 box-border hidden h-[calc(-34px_+_27vh)] min-h-[150px] w-1/4 max-w-full px-0.5 md:block">
            {images[4] && (
              <div className="relative z-0 h-full w-full cursor-pointer text-center hover:opacity-85">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  src={images[4]?.url || "/assets/missing-image2.jpg"}
                  alt="5"
                  height={150}
                  width={150}
                />
              </div>
            )}
          </div>
        </div>
        {images.length - 5 > 0 && (
          <div className="px- absolute bottom-1.5 right-2 hidden cursor-pointer items-center rounded border bg-slate-100 p-1 py-0.5 text-slate-800 md:inline-flex">
            <ImageIcon className="mr-1 h-4 w-4" /> {/* 5 are already shown */}
            <span className="text-sm font-semibold">
              {t("listing.listingImages.moreImages", {
                count: images?.length - 5,
              })}
            </span>
          </div>
        )}

        {images.length - 1 > 0 && (
          <div className="px- absolute bottom-1.5 right-2 inline-flex cursor-pointer items-center rounded border bg-slate-100 p-1 py-0.5 text-slate-800 md:hidden">
            <ImageIcon className="mr-1 h-4 w-4" /> {/* 5 are already shown */}
            <span className="text-sm font-semibold">
              {t("listing.listingImages.moreImages", {
                count: images?.length - 1,
              })}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
