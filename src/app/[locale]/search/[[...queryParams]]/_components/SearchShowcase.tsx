"use client";
import {
  ArrowDown,
  Bath,
  Bed,
  Crown,
  ImageIcon,
  LampFloor,
  MapPin,
  UserIcon,
} from "lucide-react";

import { Link } from "@/i18n/routing";
import { displayArea, displayPrice, displayPricePerSquare } from "@/lib/utils";
import ImagesCarousel from "./ImagesCarousel";
import LikeListingButton from "./LikeListingButton";
import { cn, displayDate } from "@/lib/utils";

import {
  ListingWithFavoritedBy,
  UploadedImageData,
} from "@/types/listing.types";
import { useLocale, useTranslations } from "next-intl";
import { Listing, User } from "@prisma/client";
import { ListingWithUserAndAgency } from "@/lib/types";
import {
  getMunicipalityPlaces,
  getMunicipalityPlacesTranslated,
} from "@/lib/data/macedonia/importantData";
interface SearchShowcaseProps {
  listing: Listing;
  images: UploadedImageData[];
  description: string;
}
export default function SearchShowcase({
  listing,
  images,
  description,
}: SearchShowcaseProps) {
  const t = useTranslations();
  const lwu = listing as ListingWithUserAndAgency;
  const locale = useLocale();
  const { municipality, places } = getMunicipalityPlacesTranslated(
    listing.municipality || "",
    locale,
  );

  const place = places.find((p) => p.value === listing.place);
  const locationTranslated = place ? place.label : municipality?.label;

  return (
    <li
      key={listing.id}
      className={cn("")}
      onMouseOver={() =>
        window &&
        // @ts-ignore
        window.setSelectedListingId &&
        // @ts-ignore
        window.setSelectedListingId(listing.id)
      }
      onMouseLeave={() =>
        // @ts-ignore
        window &&
        // @ts-ignore
        window.setSelectedListingId &&
        // @ts-ignore
        window.setSelectedListingId(null)
      }
    >
      <article className="mb-5 w-full @container">
        <div
          className={cn(
            "group relative flex w-full flex-col overflow-hidden rounded-lg border border-solid bg-white shadow drop-shadow transition-all ease-linear hover:shadow-xl sm:flex-row sm:items-center",
            listing.isPaidPromo && "border border-orange-500",
          )}
        >
          <figure className="relative mx-auto my-0 block">
            <div className="pointer-events-none absolute left-0 top-0 z-50 hidden w-full items-center overflow-hidden px-3.5 py-2.5 group-hover:flex">
              <div className="flex items-center gap-1.5 text-white">
                <ImageIcon size={14} />
                <span className="font-bold">{images.length}</span>
              </div>
              <div></div>
            </div>
            <div className="h-full max-h-[240px] w-full transition-[width] duration-500 @2xl:w-[320px] @3xl:w-[360px]">
              <ImagesCarousel images={images} height={240} width={260} />
            </div>
            <figcaption className="hidden">
              {t(`common.property.type.${listing.type}`)},{" "}
              {displayArea(listing.area)}
            </figcaption>
          </figure>
          <div className="relative flex-1 px-5 pb-2.5 pt-3.5">
            <div className="flex h-full flex-col justify-between">
              <div className="relative mb-2 max-w-full">
                <div className="flex items-start gap-2">
                  <h3 className="mb-1.5 overflow-hidden text-lg font-medium leading-6">
                    <span className="capitalize">
                      {t(`common.property.type.${listing.type}`)}
                    </span>
                    , {displayArea(listing.area)}
                  </h3>
                  <div className="flex gap-1">
                    {listing.isPaidPromo && (
                      <span
                        title={t("listing.labels.featured")}
                        className="relative z-10 inline-block items-center gap-1.5 rounded border p-0.5 text-xs shadow-sm"
                      >
                        <Crown size={16} />
                      </span>
                    )}

                    {listing.locationPrecision === "exact" && (
                      <span
                        title={t("listing.labels.exactLocation")}
                        className="relative z-10 inline-block items-center gap-1.5 rounded border p-0.5 text-xs shadow-sm"
                      >
                        <MapPin size={16} />
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="mb-2.5 overflow-hidden text-xs leading-5">
                  {locationTranslated || t("listing.defaultMunicipality")}
                </h3>
                <p className="text-xs">
                  <span className="text-gray-500">
                    {t("common.listing.published")}{" "}
                  </span>
                  <time dateTime={displayDate(listing.publishedAt) || ""}>
                    {displayDate(listing.publishedAt) || ""}
                  </time>
                </p>
                <p className="mb-2.5 line-clamp-3 max-h-[64px] min-h-[42px] overflow-hidden text-xs leading-5">
                  {description}
                </p>

                {/* Featured properties? */}
                <div className="flex items-center gap-6">
                  <ul className="flex gap-1.5">
                    <li
                      title={t("common.property.features.floor")}
                      className="flex items-center text-xs tracking-tighter"
                    >
                      <LampFloor width={17} height={17} className="mr-1" />
                      <span>
                        <span className="mr-0.5 text-sm font-medium">
                          {/* {listing.livingRooms} */}
                        </span>
                      </span>
                    </li>
                    <li
                      title={t(
                        "listing.new.progress.steps.mainCharacteristics.rooms.bedrooms",
                      )}
                      className="flex items-center text-xs tracking-tighter"
                    >
                      <Bed width={17} height={17} className="mr-1" />
                      <span>
                        <span className="mr-0.5 text-sm font-medium">
                          {/* {listing.bedrooms} */}
                        </span>
                        {t(
                          "listing.new.progress.steps.mainCharacteristics.rooms.bedroomsAbbr",
                        )}
                      </span>
                    </li>
                    <li
                      title={t(
                        "listing.new.progress.steps.mainCharacteristics.rooms.bathrooms",
                      )}
                      className="flex items-center text-xs tracking-tighter"
                    >
                      <Bath width={17} height={17} className="mr-1" />
                      <span>
                        <span className="mr-0.5 text-sm font-medium">
                          {/* {listing.bathrooms} */}
                        </span>
                        {t(
                          "listing.new.progress.steps.mainCharacteristics.rooms.bathroomsAbbr",
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-auto max-w-full">
                <div className="flex items-end">
                  <div className="mb-1.5 flex items-center">
                    <p className="relative text-2xl font-bold leading-4 tracking-tighter">
                      {displayPrice(listing.price)}
                    </p>
                    {listing.previousPrice &&
                      listing.previousPrice > (listing.price ?? 0) && (
                        <div className="flex items-center text-xl">
                          <ArrowDown
                            className="lowered-price ml-1 mr-0.5 h-5 w-5"
                            stroke="green"
                          />
                          <span className="text-sm text-gray-400 line-through">
                            €{displayPrice(listing.previousPrice)}
                          </span>
                        </div>
                      )}

                    <p className="ml-3 text-lg font-normal text-slate-700">
                      {displayPricePerSquare(listing.price, listing.area)}
                    </p>
                  </div>
                  <ul className="invisible relative z-10 ml-auto flex gap-1 group-hover:visible">
                    <li>
                      <LikeListingButton listingId={listing.id} />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <Link
              tabIndex={-1}
              target="_blank"
              key={listing.id}
              className="absolute inset-0 z-0"
              href={"/listing/" + listing.listingNumber}
            ></Link>
          </div>
          {/* User or Agency */}
          {lwu.agency && (
            <Link href={`/agency/${lwu.agency?.slug}`}>
              <div className="group absolute right-3 top-3 z-10 h-[30px] w-[70px] overflow-hidden rounded-md bg-slate-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    (lwu.agency?.logo as UploadedImageData).url ||
                    "/assets/missing-image.png"
                  }
                  alt={lwu.agency?.name || ""}
                  className="h-full w-full object-contain opacity-30 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </div>
            </Link>
          )}
          {lwu.user && (
            <div className="group absolute right-3 top-3 z-10 h-[40px] w-[40px] overflow-hidden rounded-md">
              {lwu.user.pictureUrl ? (
                <div>
                  <img
                    width={40}
                    height={40}
                    src={lwu.user?.pictureUrl || "/assets/missing-image.png"}
                    alt={lwu.user?.contactName || ""}
                    className="h-full w-full object-contain opacity-30 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                  {lwu.user?.contactName ? (
                    lwu.user.contactName?.split(" ")[0].charAt(0) +
                    lwu.user.contactName?.split(" ")[1].charAt(0)
                  ) : (
                    <UserIcon className="h-8 w-8" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </li>
  );
}
