import { ImageIcon, PictureInPicture2 } from "lucide-react";
import { Listing } from "@prisma/client";
import Image from "next/image";

export default function ListingImages({
  listing,
}: {
  listing: Listing;
}) {
  return (
    <div className="rounded-xl overflow-hidden relative">
      <div className="block min-h-[300px] h-[calc(-64px_+_54vh)] overflow-y-hidden  z-0 ">
        <div className="h-full md:w-1/2 w-full box-border max-w-full px-0.5 float-left min-h-[300px] relative ">
          <div className="cursor-pointer h-full relative w-full z-0 text-center">
            <Image
              fetchPriority="high"
              className="inset-0 absolute h-full w-full object-cover object-center"
              src={listing.images[0]}
              alt="Main Image"
              height={300}
              width={300}
            />
          </div>
        </div>

        <div className="hidden md:block h-[calc(-34px_+_27vh)]  w-1/4 mb-1.5 box-border max-w-full px-0.5 float-left min-h-[150px] relative ">
          <div className="cursor-pointer h-full relative w-full z-0 text-center">
            <img
              className="inset-0 absolute h-full w-full object-cover object-center"
              src={listing.images[1]}
              alt="Second Image"
              height={150}
              width={150}
            />
          </div>
        </div>
        <div className="hidden md:block h-[calc(-34px_+_27vh)]  w-1/4 mb-1.5 box-border max-w-full px-0.5 float-left min-h-[150px] relative ">
          <div className="cursor-pointer h-full relative w-full z-0 text-center">
            <img
              fetchPriority="high"
              className="inset-0 absolute h-full w-full object-cover object-center"
              src={listing.images[2]}
              alt="Main Image"
              height={150}
              width={150}
            />
          </div>
        </div>
        <div className="hidden md:block h-[calc(-34px_+_27vh)]  w-1/4 mb-1.5 box-border max-w-full px-0.5 float-left min-h-[150px] relative ">
          <div className="cursor-pointer h-full relative w-full z-0 text-center">
            <img
              fetchPriority="high"
              className="inset-0 absolute h-full w-full object-cover object-center"
              src={listing.images[3]}
              alt="Main Image"
              height={150}
              width={150}
            />
          </div>
        </div>
        <div className="hidden md:block h-[calc(-34px_+_27vh)]  w-1/4 mb-1.5 box-border max-w-full px-0.5 float-left min-h-[150px] relative ">
          <div className="cursor-pointer h-full relative w-full z-0 text-center">
            <img
              fetchPriority="high"
              className="inset-0 absolute h-full w-full object-cover object-center"
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
      <div className="absolute bottom-1.5 right-2 px- py-0.5 inline-flex border border-gray-400 text-white   bg-white/20 backdrop-blur-sm p-1 rounded items-center cursor-pointer">
        <ImageIcon className="h-4 w-4 mr-1" />{" "}
        {/* 5 are already shown */}
        <span className="font-semibold text-sm">
          {listing.images.length}
        </span>
      </div>
    </div>
  );
}
