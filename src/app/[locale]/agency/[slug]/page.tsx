import Container from "@/components/shared/Container";
import RevealButton from "@/components/shared/RevealButton";
import { Building, House, LandPlot, Store } from "lucide-react";
import prismadb from "@/lib/db";
import { getTranslations } from "next-intl/server";
import PopularAgencyListings from "./PopularAgencyListings";
import { UploadedImageData } from "@/types/listing.types";
import { Listing, ListingStatus, PropertyCategory } from "@prisma/client";
import { getCurrentUser } from "@/lib/sessions";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Suspense } from "react";
import MapLocationPreview from "@/components/shared/MapLocationPreviewClient";

const icons = {
  [PropertyCategory.commercial]: <Store className="mr-1 h-9 w-9" />,
  [PropertyCategory.residential]: <House className="mr-1 h-9 w-9" />,
  [PropertyCategory.land]: <LandPlot className="mr-1 h-9 w-9" />,
  [PropertyCategory.other]: <Building className="mr-1 h-9 w-9" />,
};
export const dynamic = "force-static";
export const revalidate = 360;
export const dynamicParams = true;
export async function generateStaticParams() {
  const listings = await prismadb.agency.findMany({
    where: {
      isPublic: true,
    },
    select: {
      slug: true,
    },
  });

  // Generate params for all locales and listings
  const params = listings.flatMap((listing) => {
    const locales = ["en", "mk", "al"];
    return locales.map((locale) => ({
      locale,
      slug: listing.slug,
    }));
  });
  // console.log("Generated static params for agency", params);
  return params;
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> => {
  const { slug, locale } = await params;
  const agency = await prismadb.agency.findUnique({
    where: {
      slug: slug,
    },
    select: {
      logo: true,
    },
  });
  // get the Stranica na agencija from translations
  // but we need to pass const t = await getTranslations({locale, namespace: 'path'});
  return {
    title: `${slug} Страница на агенција`,
    description: `${slug} Страница на агенција`,
    openGraph: {
      title: `${slug} Страница на агенција`,
      description: `${slug} Страница на агенција`,
      images: [
        {
          url: `${(agency?.logo as UploadedImageData)?.url}`,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Adresa.mk - Homepage",
      description: "Вебсајт за огласи за недвижнини",
      images: [`${(agency?.logo as UploadedImageData)?.url}`],
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
export default async function AgencyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations();
  const { user } = await getCurrentUser();
  const agency = await prismadb.agency.findUnique({
    where: {
      slug: slug,
    },
    include: {
      listings: {
        select: {
          category: true,
          id: true,
          price: true,
          previousPrice: true,
          mainImage: true,
          listingNumber: true,
          municipality: true,
          place: true,
          area: true,
          type: true,
          transactionType: true,
          favoritedBy: {
            select: {
              userId: true,
            },
          },
        },
        where: {
          status: ListingStatus.ACTIVE,
          isPublished: true,
          isAvailable: true,
        },

        // take: 8,
      },
    },
  });

  console.log("agency", agency?.listings);
  if (!agency) {
    return <div>{t("agency.notFound")}</div>;
  }

  const groupedListings = agency.listings.reduce(
    (acc, listing) => {
      const key = `${listing.transactionType}-${listing.category}-${listing.type}`;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key]++;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topFourGroups = Object.entries(groupedListings)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);
  const logoUrl =
    (agency.logo as UploadedImageData)?.url || "/assets/missing-image2.jpg";

  console.log("Agency Listings", agency.listings.slice(0, 8));

  const coords = agency.gpsLocation?.split(",");
  const coordinates = {
    latitude: coords?.[0] ? parseFloat(coords[0]) : null,
    longitude: coords?.[1] ? parseFloat(coords[1]) : null,
  };
  console.log("coordinates", coordinates);
  return (
    <main className="min-h-screen">
      <div
        style={
          {
            // background: `url(${logoUrl}) no-repeat right 10%`,
          }
        }
        className="relative"
      >
        <div className="absolute top-0.5 h-full min-h-[300px] w-full backdrop-blur-md"></div>

        <Container>
          {/* Hero */}
          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col justify-center">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                width={160}
                height={120}
                src={logoUrl}
                alt={agency.name || ""}
                className="h-[120px] w-[160px] rounded-xl border border-slate-300 object-fill"
              />
              <div className="flex flex-1 flex-col justify-between py-2">
                <p className="max-w-[42ch] leading-4 text-brand-black">
                  {agency.shortDescription}
                </p>
                <h3 className="max-w-[72ch] text-4xl font-semibold">
                  {agency.name}
                </h3>
              </div>
            </div>
            <p className="whitespace-pre-line text-brand-black">
              {agency.description}
            </p>
            {/* Grouped Listings */}
            <div className="my-7 flex flex-wrap items-stretch gap-3">
              {topFourGroups.map(([key, count]) => {
                const [transactionType, category, type] = key.split("-");

                return (
                  <Link
                    href={`/agency/${slug}/search/t-${transactionType}/c-${category}/t-${type}`}
                    // prefetch
                    target="_blank"
                    className="min-w-36"
                    key={key}
                  >
                    <div className="cursor-pointer rounded-lg bg-brand-darker-blue p-2 text-sm text-white hover:bg-sky-950">
                      <div className="mb-2 flex items-end gap-1">
                        {icons[category as PropertyCategory]}
                        <div className="font-bold">
                          <p>{count}</p>
                          <p>{t(`common.property.category.${category}`)}</p>
                        </div>
                      </div>
                      <p className="text-nowrap text-xs font-medium lowercase">
                        {t(`common.words.for`)}{" "}
                        {t(`listing.transactionType.${transactionType}`)} {">"}
                      </p>
                    </div>
                  </Link>
                );
              })}

              <Link
                href={`/agency/${slug}/search`}
                // prefetch
                target="_blank"
                key={"all"}
              >
                <div className="flex h-full cursor-pointer flex-col justify-between rounded-lg bg-brand-darker-blue p-2 text-sm text-white hover:bg-sky-950">
                  <div className="mb-2 gap-1">
                    <p className="text-left text-3xl font-semibold">
                      {agency.listings.length}
                    </p>
                  </div>
                  <p className="mt-auto text-nowrap">
                    {t(`agency.properties.allListings`)} {">"}
                  </p>
                </div>
              </Link>
            </div>
            <div className="my-3 text-slate-700">
              <p className="font-light">{agency.address}</p>
              {/* <p>{t("agency.contact.hours")}</p>
              <p className="whitespace-pre-line">{agency.workHours}</p> */}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <RevealButton
                usecase="website"
                value={agency.website ?? ""}
                variant="outline"
                className="bg-white"
              />
              <RevealButton
                usecase="phone"
                variant="outline"
                value={agency.contactPersonPhone ?? ""}
                className="bg-white"
              />
            </div>
          </div>
        </Container>

        {/* Popular Agency Properties */}
      </div>
      {agency.listings.length > 0 && (
        <div className="bg-brand-darker-blue text-white">
          <PopularAgencyListings
            listings={
              (agency.listings.slice(0, 8) as unknown as Listing[]) || []
            }
            title={t("agency.properties.popularListings", {
              agencyName: agency.name,
            })}
          />
        </div>
      )}

      <article className="mx-auto flex max-w-4xl flex-col gap-5 px-8 py-14 text-brand-black sm:flex-row">
        {/* Agency Info */}
        <div>
          <h3 className="mb-4 text-2xl font-bold">{agency.name}</h3>
          <p className="mb-6">{agency.address}</p>

          <div className="my-4 flex flex-col gap-3">
            <h4 className="font-light">{t("agency.contact.hours")}</h4>
            <p className="font-semibold">{agency.workHours}</p>
          </div>

          <div className="my-4 flex flex-col gap-3">
            <h4 className="font-light">
              {t("agency.profile.details.contactPerson")}
            </h4>
            <p className="font-semibold">{agency.contactPersonFullName}</p>
          </div>

          <RevealButton
            usecase="website"
            value={agency.website ?? ""}
            variant="outline"
            className="bg-white"
          />
          <RevealButton
            usecase="phone"
            value={agency.contactPersonPhone ?? ""}
            variant="outline"
            className="bg-white"
          />
        </div>
        {/* Map */}
        <div className="w-full">
          <Suspense
            fallback={<div className="h-[400px] animate-pulse bg-slate-200" />}
          >
            <MapLocationPreview
              coordinates={coordinates}
              locationPrecision={"exact"}
              pinPopupText={agency.name || ""}
            />
          </Suspense>
        </div>
      </article>
    </main>
  );
}
