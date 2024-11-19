export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata = {
  title: "Listing Details",
  description: "View property listing details",
};
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bath, Share, ShowerHead } from "lucide-react";

import { AirVentIcon, Heart, Percent } from "lucide-react";
import { redirect } from "next/navigation";
import MiniContactForm from "./_components/MiniContactForm";
import RevealButton from "@/components/shared/RevealButton";
import {
  cn,
  displayDate,
  displayPrice,
  displayPricePerSquare,
} from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/db";
import { ListingWithOwnerAndAgency, SerializedListing } from "@/lib/types";
import ListingBreadcrumbs from "./_components/ListingBreadcrumbs";
import { Link } from "@/i18n/routing";
import ListingActions from "./_components/ListingActions";
import ListingImages from "./_components/ListingImages";
import FeaturesTable from "./_components/FeaturesTable";
import InternalFeatures from "./_components/InternalFeatures";
import ExternalFeatures from "./_components/ExternalFeatures";

import StickyControls from "./_components/StickyControls";

import MapLocationPreview from "@/components/shared/MapLocationPreviewClient";
import Image from "next/image";
import { extractPublisherData } from "./helpers";
import { getListing } from "@/server/actions/listing.actions";

function serializeDates(listing: ListingWithOwnerAndAgency): SerializedListing {
  return {
    ...listing,
    createdAt: displayDate(listing.createdAt) || "",
    updatedAt: displayDate(listing.updatedAt) || "",
    availabilityDate: displayDate(listing.availabilityDate) || "",
    publishedAt: displayDate(listing.publishedAt),
    publishEndDate: displayDate(listing.publishEndDate),
  };
}

export default async function SingleListingPage({
  params,
}: {
  params: Promise<{ listingNumber: string }>;
}) {
  const { listingNumber } = await params;
  // console.log(listingNumber);
  if (isNaN(Number(listingNumber))) {
    redirect("/404");
  }

  const rawListing = await getListing(listingNumber);
  const listing = serializeDates(rawListing);
  // console.log("Listing", listing);

  // Query the database to check if this listing is favorited by the user

  const publisherData = extractPublisherData(listing);

  return (
    <article className="">
      {/* Above Images Breadcrumbs and Action Buttons */}
      <section className="px-0 py-4">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 md:flex-row">
          {/* Figure out what back means, where the link should lead to */}
          <Link
            href="/"
            className="mr-5 inline-flex items-center text-xs font-semibold"
          >
            <Button variant={"ghost"}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
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
                  {listing.address}
                </p>
              </div>
              <div className="max-w-[230px] flex-shrink-0 flex-grow-0">
                <span className="float-right mb-3">
                  <RevealButton
                    variant="outline"
                    usecase="phone"
                    value={publisherData.phone}
                  />
                </span>
                <p className="mt-2.5 text-sm">
                  Posted on {displayDate(listing.publishedAt)}
                </p>
              </div>
            </div>

            {/* Price and Buttons - Interactions */}
            <div className="flex">
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-center gap-3 text-xl">
                  <span className="font-semibold">
                    {displayPrice(listing.price)}
                  </span>
                  <span>| </span>
                  <span className="text-slate-400">
                    {displayPricePerSquare(listing.price, listing.area)}
                  </span>
                </div>
                <div className="flex gap-3">{/* ADD Feaures */}</div>
              </div>
              <div className="ml-auto flex gap-2">
                <div className="flex flex-col items-center gap-2">
                  <Heart />
                  favourite
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Share />
                  share
                </div>
              </div>
            </div>

            {/* Features Highlight - some imporant features mentioned */}

            <div className="mb-6 flex gap-9">
              {/* { renderHighLightedFeatures({
                'bathroom: listing.bathrooms,
                'aircon': 1,
                'garage': listing.parking
              })} */}
              <div className="flex flex-col items-center">
                <Bath className="h-8 w-8" />
                <span>
                  {listing.bathrooms} bathroom
                  {listing.bathrooms && listing.bathrooms > 1 && "s"}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <AirVentIcon className="h-8 w-8" />
                <span>
                  {1} aircon
                  {1 && 1 > 1 && "s"}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <AirVentIcon className="h-8 w-8" />
                <span>{listing.parking} garage</span>
              </div>
            </div>

            {/* Mortgages Options */}
            <Separator className="my-3 bg-slate-400" />
            <div className="my-4 flex flex-wrap items-center justify-between gap-4 lg:flex-nowrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/halkbank-logo.png" alt="Halkbank" />
              <span>Check your options</span>
              <Button className="flex gap-2">
                <Percent
                  className="h-6 w-6 rounded-full bg-white p-1"
                  stroke="#0069fe"
                />{" "}
                Calculate payments
              </Button>
            </div>
            <Separator className="my-3 bg-slate-400" />

            {/* Description */}
            <div className="my-7">
              <h3 className="mb-3 text-lg font-semibold">Description</h3>
              <p className="text-lg text-gray-700">{listing.description}</p>
            </div>

            <Separator className="my-3 bg-slate-400" />

            {/* Characteristics */}
            <div className="my-7 px-2">
              <h3 className="mb-3 text-lg font-semibold">Characteristics</h3>
              <div>
                <div>
                  <FeaturesTable listing={listing} />
                </div>

                <div>
                  <div className="my-3 flex items-center gap-3 overflow-x-hidden">
                    Inside <Separator />
                  </div>

                  <div className="flex items-center gap-3 px-2">
                    {/* Add Inside features */}
                    <InternalFeatures listing={listing} />
                  </div>

                  <div className="my-3 flex items-center gap-3 overflow-x-hidden">
                    Outside <Separator />
                  </div>

                  <div className="flex items-center gap-3 px-2">
                    {/* Add outside features */}
                    <ExternalFeatures listing={listing} />
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-3 bg-slate-400" />

            {/* Map Location */}
            <div>
              <h3 className="text-lg font-semibold">Location</h3>
              <p className="my-2.5 text-xl font-light">{listing.address}</p>
              <div className="mb-10 h-[276px] overflow-hidden border">
                <MapLocationPreview
                  latitude={listing.latitude}
                  longitude={listing.longitude}
                />
              </div>
            </div>
            <Separator className="my-3 bg-slate-400" />

            {/* Publisher  */}
            <div className="my-6">
              <h3 className="mb-3 text-lg font-semibold">
                Publisher Information
              </h3>
              <div className="flex gap-2">
                {publisherData.imgUrl && (
                  <div className="flex max-h-[130px] max-w-[200px] items-center justify-center rounded-xl border border-slate-400 bg-slate-100 px-8 py-4">
                    <Image
                      src={publisherData.imgUrl}
                      width={200}
                      height={130}
                      className="max-w-full"
                      alt="Agency Logo"
                    />
                  </div>
                )}
                <div className={cn("", publisherData.imgUrl && "pl-5")}>
                  <div className="mb-5">
                    {publisherData.shortDescription && (
                      <p className="mb-1.5 leading-4">
                        {publisherData.shortDescription}
                      </p>
                    )}
                    <h3 className="mb-2 text-2xl font-semibold">
                      {publisherData.name}
                    </h3>
                    <p className="mb-1.5 leading-4">{publisherData.address}</p>
                  </div>
                  <div className="mt-10">
                    <p>Contact Hours:</p>
                    <p>{publisherData.workHours}</p>
                    <RevealButton
                      usecase="phone"
                      value={publisherData.phone || ""}
                    />
                  </div>
                </div>
              </div>
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

export async function generateStaticParams() {
  // Get all possible listing numbers from your database
  const listings = await prismadb.listing.findMany({
    select: { listingNumber: true },
  });

  return listings.map((listing) => ({
    listingNumber: listing.listingNumber.toString(),
  }));
}