import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Listing } from "@prisma/client";
import LikeListingButton from "../search/_components/LikeListingButton";
import { displayPrice } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { getMunicipalityInfo } from "@/lib/data/macedonia/importantData";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowDown } from "lucide-react";

export default async function ReacentlyViewedListingCard({
  listing,
}: {
  listing: Listing;
}) {
  const t = await getTranslations();
  const locale = await getLocale();

  const municipalityInfo = listing.municipality
    ? getMunicipalityInfo(listing.municipality)
    : null;
  const municipalityName = municipalityInfo
    ? locale === "mk"
      ? municipalityInfo.name_mk ||
        `${municipalityInfo.name} (${t("common.status.missing")})`
      : municipalityInfo.name
    : "";

  const tags = ["bla", "tag", "other tag", "fourth tag"];
  // const tags = listing?.tags || ["bla", "tag", "other tag"];

  //remove code when launching
  const luckyToShowPrevPricing = Math.random() < 1 / 20;

  return (
    <Card className="relative max-w-[325px] hover:shadow-lg">
      <Link
        target="_blank"
        href={`/listing/${listing.listingNumber}`}
        className="absolute inset-0 z-20"
      ></Link>
      <CardHeader className="relative p-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing?.mainImage || "/assets/missing-image2.jpg"}
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
          {!listing.title ? (
            listing.title
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
        <p className="text-[9px] text-slate-400">
          {listing.listingNumber} <span>(to be removed b4 launch)</span>{" "}
        </p>
        {municipalityName && (
          <p className="text-sm capitalize">{municipalityName}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-around px-4 pb-3">
        <span className="text-xl font-semibold">
          {displayPrice(listing.price)}
        </span>
        {(luckyToShowPrevPricing || listing.previousPrice) && (
          <span className="ml-2.5 inline-flex items-center text-sm text-slate-400 line-through">
            <ArrowDown className="h-6 w-4" stroke="green" />{" "}
            {listing.price ? displayPrice(listing.price + 30000) : "N/A"}
          </span>
        )}
        <span className="relative z-30 ml-auto">
          <LikeListingButton listingId={listing.id} />
        </span>
      </CardFooter>
    </Card>
  );
}
