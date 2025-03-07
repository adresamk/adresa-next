"use client";
import {
  ArrowDown,
  ArrowUp01,
  Bath,
  Bed,
  Crown,
  ImageIcon,
  LampFloor,
  MapPin,
  UserIcon,
} from "lucide-react";

import { Link } from "@/i18n/routing";
import {
  displayArea,
  displayPrice,
  displayPriceMonthly,
  displayPricePerSquare,
} from "@/lib/utils";
import ImagesCarousel from "./ImagesCarousel";
import LikeListingButton from "./LikeListingButton";
import { cn, displayDate } from "@/lib/utils";

import {
  ListingTitles,
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
import { figureOutTags } from "@/server/specific-utils/listings.utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const lwu = listing as ListingWithUserAndAgency & {
    residential: {
      bathroomCount: number;
      bedroomCount: number;
      floor: number;
    };
  } & {
    commercial: {
      floor: number;
      wcCount: number;
    };
  } & { isLiked: boolean };
  const locale = useLocale();
  const { municipality, places } = getMunicipalityPlacesTranslated(
    listing.municipality || "",
    locale,
  );

  const place = places.find((p) => p.value === listing.place);
  // const locationTranslated = place ? place.label : municipality?.label;
  const locationTranslated = `${municipality?.label + ","} ${place?.label}`;

  const tags: string[] = figureOutTags(listing);

  return (
    <li
      key={listing.id}
      className={cn("")}
      onMouseOver={() => {
        // console.log("", listing);
        window &&
          // @ts-ignore
          window.setSelectedListingId &&
          // @ts-ignore
          window.setSelectedListingId(listing.id);
      }}
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
            "group relative flex w-full flex-col items-stretch overflow-hidden rounded-lg border border-solid bg-white text-brand-black shadow drop-shadow transition-all ease-linear hover:shadow-xl sm:flex-row sm:items-center",
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
            {/* TAGS */}
            <div className="absolute bottom-1 left-1">
              <div className="flex gap-1">
                {tags.slice(0, 3).map((tag) => (
                  <span
                    className="rounded-md bg-white px-1.5 py-0.5 text-xs font-bold lowercase text-slate-700"
                    key={tag}
                  >
                    {t(`common.words.tags.${tag}`)}
                  </span>
                ))}
                {tags.length > 3 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative h-1 w-4">
                        <span className="absolute z-[1000] whitespace-nowrap rounded-lg bg-white p-0.5 px-1.5 text-xs font-semibold uppercase">
                          +{tags.length - 3}
                        </span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="start">
                      <div className="flex w-[94%] flex-col gap-0.5 p-1 text-slate-800">
                        {tags.slice(3).map((tag: string) => (
                          <span
                            key={tag}
                            className="w-fit whitespace-nowrap text-nowrap rounded-lg border border-slate-200 bg-white p-0.5 px-1.5 text-[10px] font-semibold uppercase shadow-sm"
                          >
                            {t(`common.words.tags.${tag}`)}
                          </span>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </figure>
          <div className="relative flex-1 self-stretch px-5 pb-2.5 pt-3.5">
            <div className="flex h-full flex-col justify-between">
              <div className="relative mb-2 max-w-full">
                <div className="flex items-start gap-2">
                  <h3 className="mb-1.5 overflow-hidden text-base font-semibold leading-6">
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
                <h3 className="mb-2.5 overflow-hidden text-sm leading-5">
                  {locationTranslated || t("listing.defaultMunicipality")}
                </h3>
                <p className="text-2xs">
                  <span className="text-brand-black-muted">
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
                    {lwu.residential && lwu.residential.floor > 0 && (
                      <li
                        title={t("common.property.features.floor")}
                        className="flex items-center text-xs tracking-tighter"
                      >
                        <ArrowUp01 className="mr-1 h-4 w-4" />
                        <span>
                          <span className="mr-0.5 text-sm font-medium">
                            {lwu.residential.floor}
                          </span>
                        </span>
                      </li>
                    )}
                    {lwu.commercial && lwu.commercial.floor > 0 && (
                      <li
                        title={t("common.property.features.floor")}
                        className="flex items-center text-xs tracking-tighter"
                      >
                        <ArrowUp01 className="mr-1 h-4 w-4" />
                        <span>
                          <span className="mr-0.5 text-sm font-medium">
                            {lwu.commercial.floor}
                          </span>
                        </span>
                      </li>
                    )}
                    {lwu.residential && lwu.residential.bedroomCount > 0 && (
                      <li
                        title={t(
                          "listing.new.progress.steps.mainCharacteristics.rooms.bedrooms",
                        )}
                        className="flex items-center text-xs tracking-tighter"
                      >
                        <Bed className="mr-1 h-4 w-4" />
                        <span>
                          <span className="mr-0.5 text-sm font-medium">
                            {lwu.residential.bedroomCount}
                          </span>
                          {t(
                            "listing.new.progress.steps.mainCharacteristics.rooms.bedroomsAbbr",
                          )}
                        </span>
                      </li>
                    )}
                    {lwu.residential && lwu.residential.bathroomCount > 0 && (
                      <li
                        title={t(
                          "listing.new.progress.steps.mainCharacteristics.rooms.bathrooms",
                        )}
                        className="flex items-center text-xs tracking-tighter"
                      >
                        <Bath className="mr-1 h-4 w-4" />
                        <span>
                          <span className="mr-0.5 text-sm font-medium">
                            {lwu.residential.bathroomCount}
                          </span>
                          {t(
                            "listing.new.progress.steps.mainCharacteristics.rooms.bathroomsAbbr",
                          )}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="mt-auto max-w-full">
                <div className="flex items-end">
                  {listing.transactionType === "sale" && (
                    <div className="mb-1.5 flex items-center">
                      <p className="relative text-2xl font-bold leading-4 tracking-tighter">
                        {displayPrice(listing.price, undefined, t)}
                      </p>
                      {listing.previousPrice &&
                        listing.previousPrice > (listing.price ?? 0) && (
                          <div className="flex items-center text-lg font-semibold">
                            <ArrowDown
                              className="lowered-price ml-1 mr-0.5 h-5 w-5"
                              stroke="green"
                            />
                            <span className="text-gray-400 line-through">
                              {displayPrice(
                                listing.previousPrice,
                                undefined,
                                t,
                              )}
                            </span>
                          </div>
                        )}

                      <p className="ml-3 text-base font-semibold">
                        {!!listing.price &&
                          listing.price > 20 &&
                          displayPricePerSquare(listing.price, listing.area)}
                      </p>
                    </div>
                  )}
                  {listing.transactionType === "rent" && (
                    <div className="mb-1.5 flex items-center">
                      <p className="relative text-xl font-bold leading-4 tracking-tighter">
                        {displayPriceMonthly(
                          listing.price,
                          "EUR",
                          t("mortgageCalculator.month"),
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <LikeListingButton
                  listingId={listing.id}
                  isLiked={lwu.isLiked}
                  className="absolute bottom-3 right-3 z-10"
                />
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
              {/* {JSON.stringify(lwu.agency.logo)} */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                width={70}
                height={40}
                src={
                  lwu.agency?.logo
                    ? (lwu.agency.logo as UploadedImageData).url
                    : "/assets/missing-image2.jpg"
                }
                alt={lwu.agency?.name || ""}
                className="absolute right-3 top-3 h-[40px] w-[70px] border border-slate-300 object-fill opacity-30 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </Link>
          )}
          {lwu.user && (
            <>
              {lwu.user.pictureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  width={70}
                  height={40}
                  src={lwu.user.pictureUrl || "/assets/missing-image.png"}
                  alt={lwu.user.contactName || ""}
                  className="absolute right-3 top-3 h-[40px] w-[70px] border border-slate-300 object-fill opacity-30 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                  {lwu.user?.contactName ? (
                    lwu.user.contactName.split(" ")[0].charAt(0) +
                    lwu.user.contactName.split(" ")[1].charAt(0)
                  ) : (
                    <UserIcon className="h-8 w-8" />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </article>
    </li>
  );
}
