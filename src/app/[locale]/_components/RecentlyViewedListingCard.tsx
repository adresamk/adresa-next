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

export default function ReacentlyViewedListingCard({
  listing,
}: {
  listing: Listing;
}) {
  const t = useTranslations();
  const locale = useLocale();

  const municipalityInfo = listing.municipality
    ? getMunicipalityInfo(listing.municipality)
    : null;
  const municipalityName = municipalityInfo
    ? locale === "mk"
      ? municipalityInfo.name_mk ||
        `${municipalityInfo.name} (${t("common.status.missing")})`
      : municipalityInfo.name
    : "";

  let tags: string[] = [];
  if (listing.isPaidPromo) {
    tags.push("featured");
  }
  const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
  if (listing.publishedAt && listing.publishedAt > sevenDaysAgo) {
    tags.push("new");
  }

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
          className="h-[194px] w-[318px] rounded-t-lg object-cover"
          alt=""
          width={318}
          height={194}
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

        {municipalityName && (
          <p className="text-sm capitalize">{municipalityName}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-around px-4 pb-3">
        <span className="text-xl font-semibold">
          {displayPrice(listing.price)}
        </span>
        {listing.previousPrice &&
          listing.price &&
          listing.previousPrice > listing.price && (
            <span className="ml-2.5 inline-flex items-center text-xs text-slate-400 line-through md:text-sm">
              <ArrowDown className="h-6 w-4" stroke="green" />{" "}
              {displayPrice(listing.previousPrice)}
            </span>
          )}
        <span className="relative z-30 ml-auto">
          <LikeListingButton listingId={listing.id} />
        </span>
      </CardFooter>
    </Card>
  );
}
