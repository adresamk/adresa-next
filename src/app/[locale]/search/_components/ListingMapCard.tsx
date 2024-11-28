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
import { displayPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import { useState } from "react";
export default function ListingMapCard({ listing }: { listing: Listing }) {
  return (
    <div className="max-h-[260px] max-w-[220px]  bg-white border border-slate-500 rounded-md overflow-y-auto no-scrollbar">
      <figure className="relative mx-auto my-0 block">
        {/* image header */}
        <div className="pointer-events-none absolute left-0 top-0 z-50 flex w-full items-center overflow-hidden px-3.5 py-2.5">
          <div className="flex items-center gap-1.5 text-white">
            <ImageIcon size={14} />
            <span className="font-bold">{listing.images.length}</span>
          </div>
          <div>
            {/* Place to use tags when we have them */}
            {/* {listing.tags} */}
          </div>
        </div>
        <div className="relative h-[120px] w-[220px] overflow-hidden">
          <ImagesCarousel images={listing.images} height={120} />
          <div className="absolute bottom-1 left-1 flex gap-1">
            {listing.isPaidPromo && (
              <span
                title="Featured Listing"
                className="inline-block items-center gap-1.5 rounded border bg-white p-0.5 text-xs shadow-sm"
              >
                <Crown size={16} />
              </span>
            )}

            {listing.locationPrecision === "exact" && (
              <span
                title="Exact location on map"
                className="inline-block items-center gap-1.5 rounded border bg-white p-0.5 text-xs shadow-sm"
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
      <Link target="_blank" href={`/listing/${listing.listingNumber}`}>
        <div className="p-1.5 text-black">
          {/* Apartment title */}
          <h3 className="mb-1 overflow-hidden text-lg font-medium leading-6">
            <span className="capitalize">{listing.type}</span>, {listing.area}m²
          </h3>
          {/* Location */}
          <h3 className="mb-1.5 overflow-hidden text-xs leading-5">
            {listing.municipality || "Municipality"}
          </h3>

          {/* Features */}
          <div className="flex items-center gap-6">
            <ul className="flex gap-1.5">
              <li
                title="Floor"
                className="flex items-center text-xs tracking-tighter"
              >
                <LampFloor width={17} height={17} className="mr-1" />
                <span>
                  <span className="mr-0.5 text-sm font-medium">
                    {listing.floorNumber}
                  </span>
                </span>
              </li>
              <li
                title="Bedrooms"
                className="flex items-center text-xs tracking-tighter"
              >
                <Bed width={17} height={17} className="mr-1" />
                <span>
                  <span className="mr-0.5 text-sm font-medium">
                    {listing.bedrooms}
                  </span>
                  br
                </span>
              </li>
              <li
                title="Bathrooms"
                className="flex items-center text-xs tracking-tighter"
              >
                <Bath width={17} height={17} className="mr-1" />
                <span>
                  <span className="mr-0.5 text-sm font-medium">
                    {listing.bathrooms}
                  </span>
                  ba
                </span>
              </li>
            </ul>
          </div>
          {/* Price */}
          <div className="mb-1.5 flex items-center">
            <p
              className="text-xl font-bold leading-4 tracking-tighter"
              style={{
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              €{displayPrice(listing.price)}
            </p>
            {/* old price */}
            {listing.previousPrice && (
              <div className="flex items-center">
                <ArrowDown className="ml-2.5 mr-1" stroke="green" />
                <span className="text-sm text-gray-400 line-through">
                  €{displayPrice(listing.previousPrice)}
                </span>
              </div>
            )}

            <div className="ml-auto">
              <ul className="flex gap-1">
                <li>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 px-0.5 text-brand-light-blue hover:text-brand-dark-blue"
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
