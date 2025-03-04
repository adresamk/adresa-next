import Container from "@/components/shared/Container";
import RevealButton from "@/components/shared/RevealButton";
import { Building, House, LandPlot, Store } from "lucide-react";
import prismadb from "@/lib/db";
import { getTranslations } from "next-intl/server";
import PopularAgencyListings from "./PopularAgencyListings";
import { UploadedImageData } from "@/types/listing.types";
import {
  CommercialPropertyType,
  LandPropertyType,
  ListingStatus,
  OtherPropertyType,
  PropertyCategory,
  PropertyTransactionType,
  ResidentalPropertyType,
} from "@prisma/client";
import { getCurrentUser } from "@/lib/sessions";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";

const icons = {
  [PropertyCategory.commercial]: <Store className="h-8 w-8" />,
  [PropertyCategory.residential]: <House className="h-8 w-8" />,
  [PropertyCategory.land]: <LandPlot className="h-8 w-8" />,
  [PropertyCategory.other]: <Building className="h-8 w-8" />,
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
      _count: {
        select: {
          listings: true,
        },
      },
      listings: {
        where: {
          status: ListingStatus.ACTIVE,
          isPublished: true,

          isAvailable: true,
        },
        include: {
          favoritedBy: {
            where: {
              userId: user?.id,
            },
          },
        },
      },
    },
  });

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
          <div className="relative z-10 flex w-full flex-col justify-center">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
              <div className="flex max-w-[160px] items-center justify-center rounded-xl border border-slate-400 bg-white p-1 sm:max-w-[250px] sm:px-5 sm:py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt={agency.name || ""}
                  className="aspect-square h-[160px] w-[160px] rounded-xl object-contain sm:h-fit sm:w-fit"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between py-2">
                <p className="max-w-[42ch]">{agency.shortDescription}</p>
                <h3 className="max-w-[72ch] text-4xl font-semibold">
                  {agency.name}
                </h3>
              </div>
            </div>
            <p className="whitespace-pre-line">{agency.description}</p>
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
                    <div className="bg-brand-darker-blue cursor-pointer rounded-lg p-2 text-sm text-white">
                      <div className="mb-2 flex items-end gap-1">
                        {icons[category as PropertyCategory]}
                        <div>
                          <p>{count}</p>
                          <p>{t(`common.property.category.${category}`)}</p>
                        </div>
                      </div>
                      <p className="text-nowrap">
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
                <div className="flex h-full cursor-pointer flex-col justify-between rounded-lg bg-blue-950 p-2 text-sm text-white">
                  <div className="mb-2 gap-1">
                    <p className="text-left text-3xl font-semibold">
                      {agency._count.listings}
                    </p>
                  </div>
                  <p className="mt-auto text-nowrap">
                    {t(`agency.properties.allListings`)} {">"}
                  </p>
                </div>
              </Link>
            </div>
            <div className="my-3 text-slate-700">
              <p>{agency.address}</p>
              <p>{t("agency.contact.hours")}</p>
              <p className="whitespace-pre-line">{agency.workHours}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <RevealButton
                usecase="website"
                value={agency.website ?? ""}
                variant="outline"
              />
              <RevealButton
                usecase="phone"
                variant="outline"
                value={agency.contactPersonPhone ?? ""}
              />
            </div>
          </div>
        </Container>

        {/* Popular Agency Properties */}
      </div>
      {agency.listings.length > 0 && (
        <div className="bg-brand-darker-blue text-white">
          <PopularAgencyListings
            listings={agency.listings.slice(0, 8)}
            title={t("agency.properties.popularListings", {
              agencyName: agency.name,
            })}
          />
        </div>
      )}
    </main>
  );
}
