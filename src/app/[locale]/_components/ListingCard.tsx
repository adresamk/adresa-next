"use client";

import { Listing } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ArrowDown, Heart } from "lucide-react";
import { displayPrice } from "@/lib/utils";
import LikeListingButton from "@/app/[locale]/search/[[...queryParams]]/_components/LikeListingButton";
import { useTranslations } from "next-intl";
import { getMunicipalityInfo } from "@/lib/data/macedoniaOld/importantData";
import { useLocale } from "next-intl";
import { ListingWithRelations, UploadedImageData } from "@/types/listing.types";
import { Link } from "@/i18n/routing";
export default function ListingCard({ listing }: { listing: Listing }) {
  const t = useTranslations();
  const locale = useLocale();

  const lwr = listing as ListingWithRelations;
  const isLiked = lwr.favoritedBy?.length > 0;
  const municipalityInfo = listing.municipality
    ? getMunicipalityInfo(listing.municipality)
    : null;
  const municipalityName = municipalityInfo
    ? locale === "mk"
      ? municipalityInfo.name_mk ||
        `${municipalityInfo.name} (${t("common.status.missing")})`
      : municipalityInfo.name
    : "";

  const image: UploadedImageData = (listing.mainImage ||
    {}) as UploadedImageData;
  const tags: string[] = [];
  return (
    <Card className="relative flex h-full w-full min-w-[200px] max-w-[325px] flex-col">
      <CardHeader className="relative p-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image?.url || "/assets/missing-image2.jpg"}
          className="aspect-video h-full min-h-[160px] w-[325px] min-w-full rounded-t-md object-cover md:min-h-[200px]"
          alt=""
          width={325}
          height={200}
        />
        <div className="absolute bottom-2 left-2 flex gap-1 text-[10px]">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-lg bg-white p-0.5 px-1.5 font-semibold uppercase text-brand-light-blue"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2.5 pb-0 pt-2 text-brand-black">
        <Link
          href={`/listing/${listing.listingNumber}`}
          className="absolute inset-0 z-0"
        ></Link>
        <p className="leading-4">
          <span className="capitalize">
            {t(`common.property.type.${listing.type}`)}
          </span>
          , {listing.area}
          {t("common.property.area")}
        </p>
        <p className={`${listing.listingNumber}`}></p>

        {municipalityName && (
          <p className="text-sm capitalize">{municipalityName}</p>
        )}
      </CardContent>
      <CardFooter className="mt-auto flex items-end justify-around px-3 pb-2 @container">
        <div className="prices gap 2 relative flex items-center">
          <div className="text-lg font-bold">{displayPrice(listing.price)}</div>
          {listing.previousPrice &&
            listing.price &&
            listing.previousPrice < listing.price && (
              <div className="absolute -top-4 right-0 flex items-center gap-1 text-xs text-gray-500 md:static">
                <ArrowDown className="h-5 w-5" stroke="green" />{" "}
                <span className="line-through">
                  {displayPrice(listing.previousPrice)}
                </span>
              </div>
            )}
        </div>
        <span className="relative z-10 ml-auto">
          <LikeListingButton
            listingId={listing.id}
            isLiked={isLiked}
            // className="items-end justify-end"
            className="absolute -bottom-1.5 -right-2"
          />
        </span>
      </CardFooter>
    </Card>
  );
}
