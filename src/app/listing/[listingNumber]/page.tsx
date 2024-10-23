import { Button } from "@/components/ui/button";
import { ArrowLeft, Bath } from "lucide-react";

import {
  AirVentIcon,
  AlarmCheck,
  BrickWall,
  DoorClosed,
  DoorOpen,
  Fence,
  Heart,
  House,
  Percent,
  PictureInPicture2,
  Share,
  ShareIcon,
  ShowerHead,
} from "lucide-react";
import { redirect } from "next/navigation";
import MiniContactForm from "./_components/MiniContactForm";
import RevealButton from "@/components/shared/RevealButton";
import { formatNumberWithDelimiter } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/db";
import { ListingContactData, ListingWithOwnerAndAgency } from "@/lib/types";
import ListingBreadcrumbs from "./_components/ListingBreadcrumbs";
import Link from "next/link";
import ListingActions from "./_components/ListingActions";
import ListingImages from "./_components/ListingImages";
import FeaturesTable from "./_components/FeaturesTable";
import InternalFeatures from "./_components/InternalFeatures";
import ExternalFeatures from "./_components/ExternalFeatures";

import dynamic from "next/dynamic";
import Image from "next/image";
import StickyControls from "./_components/StickyControls";
// import MapLocationPreview from "@/components/shared/MapLocationPreview";
const MapLocationPreview = dynamic(
  () => import("@/components/shared/MapLocationPreview"),
  {
    ssr: false, // Disable server-side rendering
  },
);
const icons: { [key: string]: JSX.Element } = {
  bathroom: <ShowerHead size={30} />,
  ac: <AirVentIcon size={30} />,
  garage: <House size={30} />,
  elevator: <DoorClosed />,
  alart: <AlarmCheck />,
  protectionDoor: <DoorOpen />,
  spajz: <DoorOpen />,
  terace: <Fence />,
  facade: <BrickWall />,
} as { [key: string]: JSX.Element };
export default async function SingleListingPage({
  params,
}: {
  params: { listingNumber: string };
}) {
  console.log(params);
  if (isNaN(Number(params.listingNumber))) {
    redirect("/404");
  }

  // improve type of listing to include the owner and agency

  const listing = (await prismadb.listing.findUnique({
    where: {
      listingNumber: Number(params.listingNumber),
    },
    include: {
      owner: {
        select: {
          agency: true,
        },
      },
    },
  })) as ListingWithOwnerAndAgency;

  console.log("Listing", listing);

  const contactData: ListingContactData = JSON.parse(
    listing?.contactData || "{}",
  );

  if (!listing) {
    redirect("/404");
  }
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
      <section className="mx-auto w-full px-5 lg:max-w-5xl">
        <div className="flex flex-wrap">
          {/* Listing Main */}

          <div className="flex-1 md:pr-2.5 lg:pr-12">
            {/* Main Info - Title - Address Phone */}
            <div className="flex md:py-9">
              <div className="flex-1 pr-7">
                <h1 className="text-xl font-medium md:text-3xl">
                  {listing.title}
                </h1>
                <p className="pt-2 text-sm tracking-tight md:text-base">
                  {listing.address}
                </p>
              </div>
              <div className="max-w-[230px] flex-shrink-0 flex-grow-0">
                <span className="float-right">
                  <RevealButton
                    variant="outline"
                    usecase="phone"
                    value={contactData.phone || ""}
                  />
                </span>
                <p className="mt-2.5 text-sm">
                  Posted on{" "}
                  {listing.publishedAt
                    ? listing.publishedAt.toDateString()
                    : ""}
                </p>
              </div>
            </div>

            {/* Price and Buttons - Interactions */}
            <div className="flex">
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-center gap-3 text-xl">
                  <span className="font-semibold">
                    {formatNumberWithDelimiter(
                      listing.price ? listing.price.toString() : "",
                    )}
                    $
                  </span>
                  <span>| </span>
                  <span className="text-slate-400">
                    {listing.price &&
                      listing.area &&
                      Math.round(listing.price / listing.area)}{" "}
                    $/m2
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
            <div className="my-4 flex items-center justify-between gap-4">
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
                <div className="flex max-h-[130px] max-w-[200px] items-center justify-center rounded-xl border border-slate-400 bg-slate-100 px-8 py-4">
                  <img
                    src={listing.owner.agency.logoUrl || ""}
                    width={200}
                    height={130}
                    className="max-w-full"
                    alt="Agency Logo"
                  />
                </div>
                <div className="pl-5">
                  <div className="mb-5">
                    <p className="mb-1.5 leading-4">
                      {listing.owner.agency.shortDescription}
                    </p>
                    <h3 className="mb-2 text-2xl font-semibold">
                      {listing.owner.agency.name}
                    </h3>
                    <p className="mb-1.5 leading-4">
                      {listing.owner.agency.address}
                    </p>
                  </div>
                  <div className="mt-10">
                    <p>Contact Hours:</p>
                    <p>{listing.owner.agency.workHours}</p>
                    <RevealButton
                      usecase="phone"
                      value={listing.owner.agency.phone || ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Listing Sidebar */}
          <div className="w-1/3 max-w-full flex-shrink-0 pt-9 md:w-[330px] lg:w-[380px]">
            <MiniContactForm listing={listing} />
          </div>
        </div>
        {/* Publisher (Agency) Details */}
        {/* <div className="mt-10 flex flex-wrap md:mt-14"></div> */}
      </section>
    </article>
  );
}
