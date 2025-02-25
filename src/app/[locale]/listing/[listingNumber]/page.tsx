export const dynamic = "force-static";
export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  // Get all active listings
  const listings = await prismadb.listing.findMany({
    where: {
      status: ListingStatus.ACTIVE,
    },
    select: {
      listingNumber: true,
    },
    // take: 1,
  });

  // Generate params for all locales and listings
  const params = listings.flatMap((listing) => {
    const locales = ["en", "mk", "al"];
    return locales.map((locale) => ({
      locale,
      listingNumber: listing.listingNumber.toString(),
    }));
  });
  // console.log("Params for generateStaticParams", params);

  return params;
}

import { Button } from "@/components/ui/button";
import { Edit, Info } from "lucide-react";

import MiniContactForm from "./_components/MiniContactForm";
import RevealButton from "@/components/shared/RevealButton";
import { cn, displayArea, displayDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/db";
import {
  ListingDescriptions,
  ListingTitles,
  ListingWithRelations,
  listingWithRelationsInclude,
  UploadedImageData,
} from "@/types/listing.types";
import ListingBreadcrumbs from "./_components/ListingBreadcrumbs";
import { Link, redirect, routing } from "@/i18n/routing";
import ListingActions from "./_components/ListingActions";
import ListingImages from "./_components/ListingImages";
import FeaturesTable from "./_components/FeaturesTable";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

import StickyControls from "./_components/StickyControls";

import MapLocationPreview from "@/components/shared/MapLocationPreviewClient";
import PriceDisplay from "./_components/PriceDisplay";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import PublisherInfo from "./_components/PublisherInfo";
import {
  Listing,
  ListingStatus,
  PropertyTransactionType,
} from "@prisma/client";
import { getMunicipalityPlacesTranslated } from "@/lib/data/macedonia/importantData";
import ListingFeatures from "./_components/ListingFeatures";
import { ExpandableDescription } from "./_components/ExpandableDescription";
import { Metadata } from "next";
import { registerListingView } from "@/server/actions/listing.actions";
import { headers } from "next/headers";
import CalculateMortgageButton from "./_components/CalculateMortgageButton";
import ImportantFeatures from "./_components/ImportantFeatures";
import BackButton from "./_components/BackButton";
import RecentlyViewedListingHandler from "./_components/RecentlyViewedListingHandler";
import { getCurrentUser } from "@/lib/sessions";
import { Suspense } from "react";

interface SingleListingPageProps {
  params: Promise<{
    listingNumber: string;
    locale: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ listingNumber: string; locale: string }>;
}): Promise<Metadata> => {
  const { listingNumber, locale } = await params;
  setRequestLocale(locale); // probably not needed here since we have it down
  // console.log("Params for generateMetadata", locale);
  const t = await getTranslations({ locale });
  // const locale2 = await getLocale();
  // console.log("Current locale from getTranslations:", locale2);
  const listing = await prismadb.listing.findUnique({
    where: {
      listingNumber: Number(listingNumber),
    },
    select: {
      area: true,
      place: true,
      municipality: true,
      price: true,
      transactionType: true,
      type: true,
      category: true,
      images: true,
    },
  });
  const { municipality, places } = getMunicipalityPlacesTranslated(
    listing?.municipality,
    locale,
  );

  const currentMunicipalityLabel = municipality?.label;
  const currentPlaceLabel = places?.find(
    (place) => place.value === listing?.place,
  )?.label;

  const fullAddress = `${currentMunicipalityLabel || t("common.words.missingValue")}, ${currentPlaceLabel || t("common.words.missingValue")}`;
  const title = `${t(`listing.transactionType.${listing?.transactionType}`)},${t(`common.property.type.${listing?.type}`)},  ${listing?.area}m²  ${t(`common.words.in`)} ${fullAddress} |  ${t("common.words.listing")}  ${t("common.words.numberAbbr")} ${listingNumber}`;
  const images = (listing?.images as UploadedImageData[])
    .map((image) => image.url)
    .slice(0, 6);
  return {
    title: title,
    description: `Оглас од Adresa.mk, вебсајт за огласи за недвижини`,
    openGraph: {
      title: title,
      description: `Оглас од Adresa.mk, вебсајт за огласи за недвижини`,
      images: images,
    },
    twitter: {
      card: "summary_large_image",
      title: "Adresa.mk - Homepage",
      description: "Вебсајт за огласи за недвижини",
      images: images,
    },
    robots: {
      index: true,
      follow: false,
      googleBot: {
        index: true,
        follow: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
};
function generateDescriptionAndTitle(listing: Listing, loc: string) {
  const locale = loc as (typeof routing.locales)[number];
  let description = "";
  let title = "";
  if (locale === "en") {
    description =
      listing.enDescription ||
      listing.mkDescription ||
      listing.alDescription ||
      "";
    const title = listing.enTitle || listing.mkTitle || listing.alTitle || "";
  } else if (locale === "al") {
    description =
      listing.alDescription ||
      listing.mkDescription ||
      listing.enDescription ||
      "";
    title = listing.alTitle || listing.mkTitle || listing.enTitle || "";
  } else if (locale === "mk") {
    description =
      listing.mkDescription ||
      listing.enDescription ||
      listing.alDescription ||
      "";
    title = listing.mkTitle || listing.enTitle || listing.alTitle || "";
  }
  return { description, title };
}

export default async function SingleListingPage({
  params,
}: SingleListingPageProps) {
  const { listingNumber, locale } = await params;
  setRequestLocale(locale);

  const { agency, user } = await getCurrentUser();

  // console.log("listingNumber", listingNumber);
  if (isNaN(Number(listingNumber))) {
    return <div>Not a listing number</div>;
  }
  // const locale = await getLocale();
  const headersList = await headers();

  const listing = (await prismadb.listing.findUnique({
    where: {
      listingNumber: Number(listingNumber),
      OR: [
        { status: ListingStatus.ACTIVE },
        {
          status: { not: ListingStatus.ACTIVE },
          AND: [{ OR: [{ userId: user?.id }, { agencyId: agency?.id }] }],
        },
      ],
    },
    include: listingWithRelationsInclude,
  })) as Listing | null;

  if (!listing) {
    redirect({ href: "/404", locale: locale });
    return null;
  }

  registerListingView(listing.id, {
    headersList,
    locale,
  });
  // Increment view count

  // Log or process the IP address and locale
  const isOwner =
    agency?.id === listing.agencyId || user?.id === listing.userId;

  const t = await getTranslations();
  const lwr = listing as ListingWithRelations;

  // console.log("Listing", listing);
  // console.log("Listing", {
  //   cateogry: common.property.category,
  //   tType: listing.transactionType,
  //   // lF: lwr.listingFeatures,
  // });
  const { municipality, places } = getMunicipalityPlacesTranslated(
    listing.municipality,
    locale,
  );

  const currentMunicipalityLabel = municipality?.label;
  const currentPlaceLabel = places?.find(
    (place) => place.value === listing.place,
  )?.label;

  // let description =
  //   listing[`${locale}Description` as keyof ListingDescriptions] || "";
  // let title = listing[`${locale}Title` as keyof ListingTitles] || "";

  const { description, title } = generateDescriptionAndTitle(listing, locale);
  // console.log("Generated content for locale:", locale, { title, description });
  const fullAddress = `${currentMunicipalityLabel || t("common.words.missingValue")}, ${currentPlaceLabel || t("common.words.missingValue")}, ${listing.address || t("common.words.missingValue")}`;
  const pinPopupText = `${t(`common.property.type.${listing.type}`)}, ${displayArea(listing.area)}, ${currentPlaceLabel}, ${currentMunicipalityLabel}, `;
  // const rawListing = await getListing(listingNumber);
  // const listing = serializeDates(rawListing);
  // const publisherData = extractPublisherData(listing);

  return (
    <article className="">
      <Suspense>
        <RecentlyViewedListingHandler listing={listing} />
      </Suspense>
      {isOwner && (
        <section className="mx-auto w-full px-5 py-5 text-sm lg:max-w-7xl">
          <div
            className={cn(
              "rounded border px-3 py-2",
              listing.status === ListingStatus.ACTIVE
                ? "border-green-500 bg-green-50"
                : "border-orange-500 bg-orange-50",
            )}
          >
            <div className="flex items-center justify-between">
              <h4 className="flex items-center">
                {listing.status !== ListingStatus.ACTIVE &&
                  t("listing.preview.previewWarning")}

                {listing.status === ListingStatus.ACTIVE &&
                  t("listing.preview.itsYourListing")}
              </h4>
              <Link href={`/listing/edit/${listing.listingNumber}`}>
                <Button>
                  {"  "}
                  <Edit className="mr-2 h-4 w-4" /> {t("common.actions.edit")}
                </Button>
              </Link>
            </div>
            {listing.status !== ListingStatus.ACTIVE && (
              <div className="mt-3 flex items-center border-t border-slate-400 py-3 pt-4">
                <Info className="mr-2 h-5 w-5 text-orange-500" />{" "}
                <p className="flex items-center text-slate-800">
                  {t("listing.preview.missingInformation")}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
      {/* Above Images Breadcrumbs and Action Buttons */}
      <section className="px-0 py-4">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 md:flex-row">
          <BackButton />
          <ListingBreadcrumbs listing={listing} />
          <ListingActions listing={listing} />
        </div>
      </section>

      {/* Sticky Header */}
      <StickyControls listing={listing} />
      {/* Images */}
      <section className="mx-auto w-full px-5 lg:max-w-7xl">
        <Suspense
          fallback={<div className="h-[400px] animate-pulse bg-slate-200" />}
        >
          <ListingImages
            listing={listing}
            currentMunicipalityLabel={currentMunicipalityLabel || ""}
            currentPlaceLabel={currentPlaceLabel || ""}
          />
        </Suspense>
      </section>
      {/* Main section with Info */}
      <section className="mx-auto w-full px-5 lg:max-w-7xl">
        <div className="flex flex-wrap">
          {/* Listing Main */}
          <div className="flex-1 md:pr-2.5 lg:pr-12">
            {/* Main Info - Title - Address Phone */}
            <div className="flex pb-5 pt-9 md:py-9">
              <div className="flex-1 pr-2 md:pr-7">
                <h1 className="text-xl font-medium md:text-3xl">{title}</h1>
                <p className="pt-2 text-sm tracking-tight md:text-base">
                  {fullAddress}
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
                  {listing.publishedAt ? (
                    displayDate(listing.publishedAt)
                  ) : (
                    <b className="text-red-500">
                      {t("common.property.metadata.notPublished")}
                    </b>
                  )}
                </p>
              </div>
            </div>

            {/* Price and Buttons - Interactions */}
            <div className="flex items-center justify-between">
              {/* Features Highlight - some imporant features mentioned */}
              <ImportantFeatures listing={listing} />
              <PriceDisplay listing={listing} />
            </div>

            {/* Mortgages Options */}
            <Separator className="my-3 bg-slate-400" />
            {listing.transactionType === PropertyTransactionType.sale &&
              false && (
                <>
                  <div className="my-4 flex flex-wrap items-center justify-center gap-4 lg:flex-nowrap lg:justify-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {/* <img src="/assets/halkbank-logo.png" alt="Halkbank" /> */}
                    {/* <span>{t("common.property.mortgage.options")}</span> */}
                    <CalculateMortgageButton />
                  </div>
                  <Separator className="my-3 bg-slate-400" />
                </>
              )}

            {/* Description */}
            <div className="my-7">
              <h3 className="mb-3 text-lg font-semibold">
                {t("common.property.description")}
              </h3>
              <ExpandableDescription
                text={description}
                maxHeight={130}
                className="text-base text-gray-700 duration-1000"
              />
            </div>

            <Separator className="my-3 bg-slate-400" />

            {/* Characteristics */}
            <div className="my-7">
              <h3 className="mb-3 text-lg font-semibold">
                {t("common.property.characteristics")}
              </h3>
              <div>
                <FeaturesTable listing={listing} />
                <ListingFeatures listing={listing} />
              </div>
            </div>
            <Separator className="my-3 bg-slate-400" />

            {/* Map Location */}
            <div>
              <h3 className="text-lg font-semibold">
                {t("common.property.location")}
              </h3>
              <p className="my-2.5 text-xl font-light">{fullAddress}</p>
              <Suspense
                fallback={
                  <div className="h-[400px] animate-pulse bg-slate-200" />
                }
              >
                <MapLocationPreview
                  listing={listing}
                  pinPopupText={pinPopupText}
                />
              </Suspense>
            </div>

            <Separator className="my-3 bg-slate-400" />
            {/* Mortgage Calculator */}
            {listing.transactionType === PropertyTransactionType.sale && (
              <Suspense
                fallback={
                  <div className="h-[400px] animate-pulse bg-slate-200" />
                }
              >
                {/* <MortgageCalculator initialPrice={listing.price || 0} /> */}
              </Suspense>
            )}
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
            <Suspense
              fallback={
                <div className="h-[400px] animate-pulse bg-slate-200" />
              }
            >
              <MiniContactForm listing={listing} />
            </Suspense>
          </div>
        </div>
        {/* Publisher (Agency) Details */}
        {/* <div className="mt-10 flex flex-wrap md:mt-14"></div> */}
      </section>
    </article>
  );
}
