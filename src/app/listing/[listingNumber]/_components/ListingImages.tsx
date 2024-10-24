"use client";
import { ImageIcon, LayoutGrid } from "lucide-react";
import { Listing } from "@prisma/client";
import Image from "next/image";
import { Modal } from "@/components/shared/Modal";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumberWithDelimiter } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ListingImages({ listing }: { listing: Listing }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openTab, setOpenTab] = useState("singleAtATime");
  const [openImageIndex, setOpenImageIndex] = useState<null | number>(null);
  function onClose() {
    setIsOpen(false);
  }
  function handlePhotoSelection(idx: number) {
    if (idx > listing.images.length - 1 || idx < 0) {
      console.error("Invalid index");
      return;
    }
    setOpenTab("singleAtATime");
    setOpenImageIndex(idx);
  }
  return (
    <>
      <Modal
        title={"All Images"}
        description={"Explore everything"}
        isOpen={isOpen}
        onClose={onClose}
        className="h-full max-w-[97vw]"
      >
        <div className="h-[calc(97vh_-_90px)] max-h-[97vh] min-h-full">
          <Tabs value={openTab} className="w-fit">
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
            <TabsContent value="overview">
              <div className="photoGridContainer flex flex-grow flex-wrap overflow-auto">
                {listing.images.map((imageUrl, idx) => (
                  <div
                    onClick={() => handlePhotoSelection(idx)}
                    className="mb-3 h-fit w-full max-w-full flex-shrink-0 px-1.5 min-[440px]:w-1/2 sm:flex-auto sm:flex-shrink sm:flex-grow md:w-1/3"
                  >
                    <figure className="h-[25vh] max-h-[300px] min-h-[100px] cursor-pointer overflow-hidden rounded-xl">
                      <img
                        src={imageUrl}
                        alt={`Photo ${idx + 1},${listing.type}, ${listing.area}m²,${listing.place}, ${listing.manucipality},€${formatNumberWithDelimiter(listing.price?.toString() || "")}`}
                        width={800}
                        height={533}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                      />
                    </figure>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="singleAtATime">
              <div className="relative max-h-full w-full overflow-auto bg-slate-800 px-12">
                <Carousel
                  className="h-fit"
                  opts={{
                    align: "start",
                    startIndex: openImageIndex || 0,
                  }}
                >
                  <CarouselContent className="max-w-[900px]">
                    {listing.images.map((imageUrl, idx) => (
                      <CarouselItem
                        key={idx}
                        className="flex max-h-[75vh] basis-full items-center justify-center"
                      >
                        <figure className="max-w-fit">
                          <img
                            src={imageUrl}
                            alt={`Photo ${idx + 1},${listing.type}, ${listing.area}m²,${listing.place}, ${listing.manucipality},€${formatNumberWithDelimiter(listing.price?.toString() || "")}`}
                            width={800}
                            height={533}
                            className="h-full w-full object-cover object-center"
                            loading="lazy"
                          />
                        </figure>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="ml-2" />
                  <CarouselNext className="mr-2" />
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
        <div className="z-0 block h-[calc(-64px_+_54vh)] min-h-[300px] overflow-y-hidden">
          <div className="relative float-left box-border h-full min-h-[300px] w-full max-w-full px-0.5 md:w-1/2">
            <div className="relative z-0 h-full w-full cursor-pointer text-center hover:opacity-85">
              <Image
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-center"
                src={listing.images[0]}
                alt="Main Image"
                height={300}
                width={300}
              />
            </div>
          </div>

          <div className="relative float-left mb-1.5 box-border hidden h-[calc(-34px_+_27vh)] min-h-[150px] w-1/4 max-w-full px-0.5 md:block">
            <div className="relative z-0 h-full w-full cursor-pointer text-center hover:opacity-85">
              <img
                className="absolute inset-0 h-full w-full object-cover object-center"
                src={listing.images[1]}
                alt="Second Image"
                height={150}
                width={150}
              />
            </div>
          </div>
          <div className="relative float-left mb-1.5 box-border hidden h-[calc(-34px_+_27vh)] min-h-[150px] w-1/4 max-w-full px-0.5 md:block">
            <div className="relative z-0 h-full w-full cursor-pointer text-center hover:opacity-85">
              <img
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-center"
                src={listing.images[2]}
                alt="Main Image"
                height={150}
                width={150}
              />
            </div>
          </div>
          <div className="relative float-left mb-1.5 box-border hidden h-[calc(-34px_+_27vh)] min-h-[150px] w-1/4 max-w-full px-0.5 md:block">
            <div className="relative z-0 h-full w-full cursor-pointer text-center hover:opacity-85">
              <img
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-center"
                src={listing.images[3]}
                alt="Main Image"
                height={150}
                width={150}
              />
            </div>
          </div>
          <div className="relative float-left mb-1.5 box-border hidden h-[calc(-34px_+_27vh)] min-h-[150px] w-1/4 max-w-full px-0.5 md:block">
            <div className="relative z-0 h-full w-full cursor-pointer text-center hover:opacity-85">
              <img
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-center"
                src={listing.images[4]}
                alt="Main Image"
                height={150}
                width={150}
              />
            </div>
          </div>
          {/* <div className="w-1/2">
          <img
            src={listing.mainImage || ""}
            alt="Main image"
            className="w-full h-full rounded"
          />
        </div> */}
          {/* <div className="w-1/2 grid grid-cols-2 gap-3">
          {listing.images.slice(1, 5).map((imageUrl, idx) => (
            <img
              key={idx}
              src={imageUrl}
              alt="Room image"
              className="rounded"
            />
          ))}
        </div> */}
        </div>
        <div className="px- absolute bottom-1.5 right-2 inline-flex cursor-pointer items-center rounded border border-gray-400 bg-white/20 p-1 py-0.5 text-white backdrop-blur-sm">
          <ImageIcon className="mr-1 h-4 w-4" /> {/* 5 are already shown */}
          <span className="text-sm font-semibold">{listing.images.length}</span>
        </div>
      </div>
    </>
  );
}
