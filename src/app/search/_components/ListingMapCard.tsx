import { Listing } from "@prisma/client";
import {
  ArrowDown,
  Bath,
  Bed,
  Crown,
  Heart,
  ImageIcon,
  LampFloor,
  MapPin,
} from "lucide-react";
import ImagesCarousel from "./ImagesCarousel";
import { formatNumberWithDelimiter } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
export default function ListingMapCard({
  listing,
}: {
  listing: Listing;
}) {
  return (
    <div className="max-w-[400px]  ">
      <figure className="my-0 mx-auto block relative">
        {/* image header */}
        <div className="absolute z-50 top-0 left-0 w-full  items-center py-2.5 px-3.5 pointer-events-none overflow-hidden flex">
          <div className="text-white flex items-center gap-1.5">
            <ImageIcon size={14} />
            <span className="font-bold">{listing.images.length}</span>
          </div>
          <div>
            {/* Place to use tags when we have them */}
            {/* {listing.tags} */}
          </div>
        </div>
        <div className="w-[200px] h-[160px] relative overflow-hidden">
          <ImagesCarousel images={listing.images} />
          <div className="flex gap-1 absolute bottom-1 left-1 ">
            {listing.isPaidPromo && (
              <span
                title="Featured Listing"
                className="border inline-block p-0.5 rounded items-center gap-1.5 text-xs  shadow-sm bg-white"
              >
                <Crown size={16} />
              </span>
            )}

            {listing.locationPrecision === "exact" && (
              <span
                title="Exact location on map"
                className="border inline-block p-0.5 rounded items-center gap-1.5 text-xs shadow-sm bg-white"
              >
                <MapPin size={16} />
              </span>
            )}
          </div>
        </div>
        <figcaption className="hidden">
          {listing.type}, {listing.area}m²
        </figcaption>
      </figure>
      <Link
        target="_blank"
        href={`/listing/${listing.listingNumber}`}
      >
        <div className="p-1.5 text-black">
          {/* Apartment title */}
          <h3 className="text-lg leading-6 font-medium mb-1 overflow-hidden">
            <span className="capitalize">{listing.type}</span>,{" "}
            {listing.area}m²
          </h3>
          {/* Location */}
          <h3 className="text-xs leading-5 mb-1.5 overflow-hidden">
            {listing.manucipality || "Municipality"}
          </h3>

          {/* Features */}
          <div className="flex gap-6 items-center">
            <ul className="flex gap-1.5">
              <li
                title="Floor"
                className="text-xs tracking-tighter flex items-center"
              >
                <LampFloor width={17} height={17} className="mr-1" />
                <span>
                  <span className="font-medium text-sm mr-0.5">
                    {listing.floorNumber}
                  </span>
                </span>
              </li>
              <li
                title="Bedrooms"
                className="text-xs tracking-tighter flex items-center"
              >
                <Bed width={17} height={17} className="mr-1" />
                <span>
                  <span className="font-medium text-sm mr-0.5">
                    {listing.bedrooms}
                  </span>
                  br
                </span>
              </li>
              <li
                title="Bathrooms"
                className="text-xs tracking-tighter flex items-center"
              >
                <Bath width={17} height={17} className="mr-1" />
                <span>
                  <span className="font-medium text-sm mr-0.5">
                    {listing.bathrooms}
                  </span>
                  ba
                </span>
              </li>
            </ul>
            {/* <p className="text-xs ">
            <span className="text-gray-500">Updated: </span>
            <time
              dateTime={listing.updatedAt
                .toISOString()
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/")}
            >
              {listing.updatedAt
                .toISOString()
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/")}
            </time>
          </p> */}
          </div>
          {/* Price */}
          <div className="flex items-center mb-1.5 ">
            <p className="font-bold leading-4 tracking-tighter text-xl m-y-2">
              €
              {formatNumberWithDelimiter(
                listing.price?.toString() || ""
              )}
            </p>
            {/* old price */}
            {listing.previousPrice && (
              <div className="flex items-center">
                <ArrowDown className="mr-1 ml-2.5" stroke="green" />
                <span className="text-sm text-gray-400 line-through">
                  €
                  {formatNumberWithDelimiter(
                    listing.previousPrice?.toString() || ""
                  )}
                </span>
              </div>
            )}

            <div className="ml-auto  ">
              <ul className="flex gap-1">
                <li>
                  <Button
                    variant="ghost"
                    className=" w-8 h-8 px-0.5 text-brand-light-blue hover:text-brand-dark-blue"
                  >
                    <Heart size={16} />
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          {/* Agency name */}
          {listing.userId && (
            <>
              <Separator />
              <div className="my-2 flex items-center">
                {/* {listing.agencyName} */}
                Landinos Real Estate
              </div>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}
