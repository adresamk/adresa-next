"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Listing } from "@prisma/client";
import LikeListingButton from "@/app/[locale]/search/[[...queryParams]]/_components/LikeListingButton";
import { displayPrice } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { getMunicipalityInfo } from "@/lib/data/macedoniaOld/importantData";
import { Link } from "@/i18n/routing";
import { ArrowDown } from "lucide-react";
import { UploadedFileData } from "uploadthing/types";
import { ListingTitles } from "@/types/listing.types";
import { getMunicipalityPlacesTranslated } from "@/lib/data/macedonia/importantData";
import { figureOutTags } from "@/server/specific-utils/listings.utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ReacentlyViewedListingCard({
  listing,
}: {
  listing: Listing;
}) {
  const t = useTranslations();
  const locale = useLocale();

  // const municipalityInfo = listing.municipality
  //   ? getMunicipalityInfo(listing.municipality)
  //   : null;
  // const municipalityName = municipalityInfo
  //   ? locale === "mk"
  //     ? municipalityInfo.name_mk ||
  //       `${municipalityInfo.name} (${t("common.status.missing")})`
  //     : municipalityInfo.name
  //   : "";

  const { municipality, places } = getMunicipalityPlacesTranslated(
    listing.municipality || "",
    locale,
  );

  const place = places.find((p) => p.value === listing.place);
  const locationTranslated = place
    ? place.label + ", " + municipality?.label
    : municipality?.label;

  let tags: string[] = figureOutTags(listing);

  // const tags = listing?.tags || ["bla", "tag", "other tag"];

  //remove code when launching

  const image = listing?.mainImage as UploadedFileData;
  const title = listing[`${locale}Title` as keyof ListingTitles] || "";

  return (
    <Card className="relative w-[240px] hover:shadow-lg md:w-[325px]">
      <Link
        target="_blank"
        href={`/listing/${listing.listingNumber}`}
        className="absolute inset-0 z-20"
      ></Link>
      <CardHeader className="relative p-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image?.url || "/assets/missing-image2.jpg"}
          className="h-[194px] w-[323px] rounded-t-lg object-cover"
          alt=""
          width={318}
          height={194}
        />
        <div className="absolute bottom-2 left-2 flex w-[94%] gap-1 overflow-x-hidden text-[10px]">
          {tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="text-nowrap rounded-lg bg-white p-0.5 px-1.5 font-semibold uppercase text-brand-light-blue"
            >
              {t(`common.words.tags.${tag}`)}
            </span>
          ))}
          {tags.length > 3 && (
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative h-1 w-4">
                  <span className="absolute z-[1000] rounded-lg bg-white p-0.5 px-1.5 font-semibold uppercase text-brand-light-blue">
                    +{tags.length - 3}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent side="top" align="start">
                <div className="flex flex-col gap-0.5 p-1">
                  {tags.slice(3).map((tag: string) => (
                    <span
                      key={tag}
                      className="w-fit rounded-lg border border-slate-200 bg-white p-0.5 px-1.5 text-[10px] font-semibold uppercase text-brand-light-blue shadow-sm"
                    >
                      {t(`common.words.tags.${tag}`)}
                    </span>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-2">
        <h3>
          {!title ? (
            title
          ) : (
            <>
              <span className="capitalize">
                {t(`common.property.type.${listing.type}`)}
              </span>
              , {listing.area}
              {t("common.property.area")}
            </>
          )}
        </h3>
        <p className={`${listing.listingNumber}`}></p>

        {locationTranslated && (
          <p className="text-sm capitalize">{locationTranslated}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-around px-4 pb-3">
        <span className="text-xl font-semibold">
          {displayPrice(listing.price, undefined, t)}
        </span>
        {listing.previousPrice &&
          listing.price &&
          listing.previousPrice > listing.price && (
            <span className="ml-2.5 inline-flex items-center text-xs text-slate-400 line-through md:text-sm">
              <ArrowDown className="h-6 w-4" stroke="green" />{" "}
              {displayPrice(listing.previousPrice, undefined, t)}
            </span>
          )}
        <span className="relative z-30 ml-auto">
          <LikeListingButton listingId={listing.id} />
        </span>
      </CardFooter>
    </Card>
  );
}
