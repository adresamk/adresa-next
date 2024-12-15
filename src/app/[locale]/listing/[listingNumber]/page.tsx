// export const dynamic = "force-static";
// export const revalidate = 86400;

export const metadata = {
  title: "Listing Details",
  description: "View property listing details",
};

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { AirVentIcon, Heart, Percent } from "lucide-react";
import MiniContactForm from "./_components/MiniContactForm";
import RevealButton from "@/components/shared/RevealButton";
import { displayDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/db";
import {
  ListingWithRelations,
  listingWithRelationsInclude,
} from "@/types/listing.types";
import ListingBreadcrumbs from "./_components/ListingBreadcrumbs";
import { Link, redirect } from "@/i18n/routing";
import ListingActions from "./_components/ListingActions";
import ListingImages from "./_components/ListingImages";
import FeaturesTable from "./_components/FeaturesTable";
import { getLocale, getTranslations } from "next-intl/server";

import StickyControls from "./_components/StickyControls";

import MapLocationPreview from "@/components/shared/MapLocationPreviewClient";
import PriceDisplay from "./_components/PriceDisplay";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import PublisherInfo from "./_components/PublisherInfo";
import { Listing } from "@prisma/client";
import { getMunicipalityPlacesTranslated } from "@/lib/data/macedonia/importantData";
import ListingFeatures from "./_components/ListingFeatures";

// function serializeDates(listing: ListingWithOwnerAndAgency): SerializedListing {
//   return {
//     ...listing,
//     createdAt: displayDate(listing.createdAt) || "",
//     updatedAt: displayDate(listing.updatedAt) || "",
//     dateAvailable: displayDate(listing.dateAvailable) || "",
//     publishedAt: displayDate(listing.publishedAt),
//     publishEndDate: displayDate(listing.publishEndDate),
//   };
// }

export default async function SingleListingPage({
  params,
}: {
  params: Promise<{ listingNumber: string; locale: string }>;
}) {
  const { listingNumber } = await params;

  console.log("listingNumber", listingNumber);
  if (isNaN(Number(listingNumber))) {
    return <div>Not a listing number</div>;
    // redirect("/404");
  }
  const locale = await getLocale();

  const listing = (await prismadb.listing.findUnique({
    where: { listingNumber: Number(listingNumber) },
    include: listingWithRelationsInclude,
  })) as Listing | null;

  if (!listing) {
    redirect({ href: "/404", locale: "mk" });
    return null;
  }
  const t = await getTranslations();
  const lwr = listing as ListingWithRelations;

  // console.log("Listing", listing);
  console.log("Listing", {
    cateogry: listing.category,
    tType: listing.transactionType,
    lF: lwr.listingFeatures,
  });
  const { municipality, places } = getMunicipalityPlacesTranslated(
    listing.municipality,
    locale,
  );

  const currentMunicipalityLabel = municipality?.label;
  const currentPlaceLabel = places?.find(
    (place) => place.value === listing.place,
  )?.label;

  // const rawListing = await getListing(listingNumber);
  // const listing = serializeDates(rawListing);
  // const publisherData = extractPublisherData(listing);

  return (
    <article className="">
      {/* Above Images Breadcrumbs and Action Buttons */}
      <section className="px-0 py-4">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 md:flex-row">
          <Link
            href="/"
            className="mr-5 inline-flex items-center text-xs font-semibold"
          >
            <Button variant={"ghost"}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("common.buttons.back")}
            </Button>
          </Link>
          <ListingBreadcrumbs listing={listing} />
          <ListingActions listing={listing} />
        </div>
      </section>

      {/* Sticky Header */}
      <StickyControls listing={listing} />
      {/* Images */}
      <section className="mx-auto w-full max-w-7xl px-5">
        <ListingImages listing={listing} />
      </section>
      {/* Main section with Info */}
      <section className="mx-auto w-full px-5 lg:max-w-6xl">
        <div className="flex flex-wrap">
          {/* Listing Main */}
          <div className="flex-1 md:pr-2.5 lg:pr-12">
            {/* Main Info - Title - Address Phone */}
            <div className="flex pb-5 pt-9 md:py-9">
              <div className="flex-1 pr-7">
                <h1 className="text-xl font-medium md:text-3xl">
                  {listing.title}
                </h1>
                <p className="pt-2 text-sm tracking-tight md:text-base">
                  {currentMunicipalityLabel}, {currentPlaceLabel},{" "}
                  {listing.address}
                </p>
              </div>
              <div className="max-w-[230px] flex-shrink-0 flex-grow-0">
                <span className="float-right mb-3">
                  <RevealButton
                    variant="outline"
                    usecase="phone"
                    value={
                      lwr.user?.phone || lwr.agency?.contactPersonPhone || ""
                    }
                  />
                </span>
                <p className="mt-2.5 text-sm">
                  {t("common.property.metadata.posted")}{" "}
                  {displayDate(listing.publishedAt)}
                </p>
              </div>
            </div>

            {/* Price and Buttons - Interactions */}
            <div className="flex items-center justify-between">
              <div className="mb-6 flex gap-9">
                {/* {listing.bathrooms && (
                  <div className="flex flex-col items-center text-sm">
                    <Bath className="h-6 w-6" />
                    <span>
                      {listing.bathrooms}{" "}
                      {listing.bathrooms === 1
                        ? t("common.property.features.bathroom")
                        : t("common.property.features.bathrooms")}
                    </span>
                  </div>
                )} */}
                <div className="flex flex-col items-center text-sm">
                  <AirVentIcon className="h-6 w-6" />
                  <span>
                    {1}{" "}
                    {1 === 1
                      ? t("common.property.features.aircon")
                      : t("common.property.features.aircons")}
                  </span>
                </div>
                {/* {listing.parking && (
                  <div className="flex flex-col items-center text-sm">
                    <AirVentIcon className="h-6 w-6" />
                    <span>
                      {listing.parking === true && "1"}
                      {listing.parking
                        ? t("common.property.features.parking")
                        : t("common.property.features.parkings")}
                    </span>
                  </div>
                )} */}
              </div>
              <PriceDisplay listing={listing} />
            </div>

            {/* Features Highlight - some imporant features mentioned */}

            {/* Mortgages Options */}
            <Separator className="my-3 bg-slate-400" />
            <div className="my-4 flex flex-wrap items-center justify-between gap-4 lg:flex-nowrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/halkbank-logo.png" alt="Halkbank" />
              <span>{t("common.property.mortgage.options")}</span>
              <Button className="flex gap-2">
                <Percent
                  className="h-6 w-6 rounded-full bg-white p-1"
                  stroke="#0069fe"
                />{" "}
                {t("common.property.mortgage.calculate")}
              </Button>
            </div>
            <Separator className="my-3 bg-slate-400" />

            {/* Description */}
            <div className="my-7">
              <h3 className="mb-3 text-lg font-semibold">
                {t("common.property.description")}
              </h3>
              <p className="text-lg text-gray-700">{listing.description}</p>
            </div>

            <Separator className="my-3 bg-slate-400" />

            {/* Characteristics */}
            <div className="my-7 px-2">
              <h3 className="mb-3 text-lg font-semibold">
                {t("common.property.characteristics")}
              </h3>
              <div>
                <div>
                  <FeaturesTable listing={listing} />
                </div>
                <ListingFeatures listing={listing} />
              </div>
            </div>
            <Separator className="my-3 bg-slate-400" />

            {/* Map Location */}
            <div>
              <h3 className="text-lg font-semibold">
                {t("common.property.location")}
              </h3>
              <p className="my-2.5 text-xl font-light">
                {" "}
                {currentMunicipalityLabel}, {currentPlaceLabel},{" "}
                {listing.address}
              </p>
              <div className="mb-10 h-[276px] overflow-hidden border">
                <MapLocationPreview
                  latitude={listing.latitude}
                  longitude={listing.longitude}
                />
              </div>
            </div>
            <Separator className="my-3 bg-slate-400" />
            {/* Mortgage Calculator */}
            <MortgageCalculator initialPrice={listing.price || 0} />
            {/* Publisher  */}
            <div className="my-6">
              <h3 className="mb-3 text-lg font-semibold">
                {t("common.property.publisher")}
              </h3>
              <PublisherInfo agency={lwr.agency} user={lwr.user} />
            </div>
          </div>
          {/* Listing Sidebar */}
          <div className="w-full max-w-full flex-shrink-0 pt-9 md:w-[330px] lg:w-[380px]">
            <MiniContactForm listing={listing} />
          </div>
        </div>
        {/* Publisher (Agency) Details */}
        {/* <div className="mt-10 flex flex-wrap md:mt-14"></div> */}
      </section>
    </article>
  );
}

// export async function generateStaticParams() {
//   // Get all possible listing numbers from your database
//   const listings = await prismadb.listing.findMany({
//     select: { listingNumber: true },
//   });

//   return listings.map((listing) => ({
//     listingNumber: listing.listingNumber.toString(),
//   }));
// }
