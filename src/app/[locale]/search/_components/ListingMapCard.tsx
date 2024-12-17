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
import { useTranslations } from "next-intl";
import { UploadedImageData } from "@/types/listing.types";

export default function ListingMapCard({ listing }: { listing: Listing }) {
  const t = useTranslations();
  const images = listing.images as UploadedImageData[];
  return (
    <div className="no-scrollbar max-h-[260px] max-w-[220px] overflow-y-auto rounded-md border border-slate-500 bg-white">
      <figure className="relative mx-auto my-0 block">
        {/* image header */}
        <div className="pointer-events-none absolute left-0 top-0 z-50 flex w-full items-center overflow-hidden px-3.5 py-2.5">
          <div className="flex items-center gap-1.5 text-white">
            <ImageIcon size={14} />
            <span className="font-bold">{images.length}</span>
          </div>
          <div>
            {/* Place to use tags when we have them */}
            {/* {listing.tags} */}
          </div>
        </div>
        <div className="relative h-[120px] w-[220px] overflow-hidden">
          <ImagesCarousel images={images} height={120} />
          <div className="absolute bottom-1 left-1 flex gap-1">
            {listing.isPaidPromo && (
              <span
                title={t("common.listing.featuredListing")}
                className="inline-block items-center gap-1.5 rounded border bg-white p-0.5 text-xs shadow-sm"
              >
                <Crown size={16} />
              </span>
            )}

            {listing.locationPrecision === "exact" && (
              <span
                title={t("common.listing.exactLocation")}
                className="inline-block items-center gap-1.5 rounded border bg-white p-0.5 text-xs shadow-sm"
              >
                <MapPin size={16} />
              </span>
            )}
          </div>
        </div>
        <figcaption className="hidden">
          {t("common.listing.propertyDetails", {
            type: listing.type,
            area: listing.area,
          })}
        </figcaption>
      </figure>
      <Link target="_blank" href={`/listing/${listing.listingNumber}`}>
        <div className="p-1.5 text-black">
          {/* Apartment title */}
          <h3 className="mb-1 overflow-hidden text-lg font-medium leading-6">
            <span className="capitalize">
              {t(`common.property.type.${listing.type}`)}
            </span>
            , {listing.area}m²
          </h3>
          {/* Location */}
          <h3 className="mb-1.5 overflow-hidden text-xs leading-5">
            {listing.municipality || t("common.listing.defaultMunicipality")}
          </h3>

          {/* Features */}
          <div className="flex items-center gap-6">
            <ul className="flex gap-1.5">
              <li
                title={t("common.listing.features.floor")}
                className="flex items-center text-xs tracking-tighter"
              >
                <LampFloor width={17} height={17} className="mr-1" />
                <span>
                  <span className="mr-0.5 text-sm font-medium">
                    {/* {listing.floorNumber} */}
                  </span>
                </span>
              </li>
              <li
                title={t("common.listing.features.bedrooms")}
                className="flex items-center text-xs tracking-tighter"
              >
                <Bed width={17} height={17} className="mr-1" />
                <span>
                  <span className="mr-0.5 text-sm font-medium">
                    {/* {listing.bedrooms} */}
                  </span>
                  {t("common.listing.features.bedroomsAbbr")}
                </span>
              </li>
              <li
                title={t("common.listing.features.bathrooms")}
                className="flex items-center text-xs tracking-tighter"
              >
                <Bath width={17} height={17} className="mr-1" />
                <span>
                  <span className="mr-0.5 text-sm font-medium">
                    {/* {listing.bathrooms} */}
                  </span>
                  {t("common.listing.features.bathroomsAbbr")}
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
            {listing.previousPrice &&
              listing.previousPrice > (listing.price ?? 0) && (
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
                Default Agency
                {/* {listing.agencyName || t('common.listing.defaultAgency')} */}
              </div>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}
