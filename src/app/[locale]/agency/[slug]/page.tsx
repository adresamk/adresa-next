import Container from "@/components/shared/Container";
import RevealButton from "@/components/shared/RevealButton";
import { House, Store } from "lucide-react";
import prismadb from "@/lib/db";
import { getTranslations } from "next-intl/server";
import PopularAgencyListings from "./PopularAgencyListings";
import { UploadedImageData } from "@/types/listing.types";
import {
  CommercialPropertyType,
  PropertyCategory,
  PropertyTransactionType,
  ResidentalPropertyType,
} from "@prisma/client";
import { getCurrentUser } from "@/lib/sessions";

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

  const apartmentsForRent = agency.listings.filter(
    (listing) =>
      listing.transactionType === PropertyTransactionType.rent &&
      listing.type === ResidentalPropertyType.apartment,
  );

  const apartmentsForSale = agency.listings.filter(
    (listing) =>
      listing.transactionType === PropertyTransactionType.sale &&
      listing.type === ResidentalPropertyType.apartment,
  );

  const housesForSale = agency.listings.filter(
    (listing) =>
      listing.transactionType === PropertyTransactionType.sale &&
      listing.type === ResidentalPropertyType.house,
  );

  const storesForRent = agency.listings.filter(
    (listing) =>
      listing.transactionType === PropertyTransactionType.rent &&
      listing.type === CommercialPropertyType.store,
  );

  const logoUrl =
    (agency.logo as UploadedImageData)?.url || "/assets/missing-image2.jpg";
  return (
    <main className="min-h-screen">
      <div
        style={{
          background: `url(${logoUrl}) no-repeat right 10%`,
        }}
        className="relative"
      >
        <div className="absolute top-0.5 h-full min-h-[300px] w-full backdrop-blur-md"></div>

        <Container>
          {/* Hero */}
          <div className="relative z-10 flex w-full flex-col justify-center">
            <div className="mb-5 flex gap-3">
              <div className="flex max-w-[250px] items-center justify-center rounded-xl border border-slate-400 bg-white px-5 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt={agency.name || ""}
                  className="aspect-square object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between py-2">
                <p>{agency.shortDescription}</p>
                <h3 className="text-4xl font-semibold">{agency.name}</h3>
              </div>
            </div>
            <p>{agency.description}</p>
            <div className="my-7 flex gap-3">
              <div className="cursor-pointer rounded-md bg-blue-950 p-2 text-sm text-white">
                <div className="mb-2 flex items-end gap-1">
                  <House size={36} />
                  <div>
                    <p>{apartmentsForSale.length}</p>
                    <p>{t("agency.properties.apartments")}</p>
                  </div>
                </div>
                <p className="text-nowrap">
                  {t("agency.properties.forSale")} {">"}
                </p>
              </div>
              <div className="cursor-pointer rounded-md bg-blue-950 p-2 text-sm text-white">
                <div className="mb-2 flex items-end gap-1">
                  <House size={36} />
                  <div>
                    <p>{apartmentsForRent.length}</p>
                    <p>{t("agency.properties.apartments")}</p>
                  </div>
                </div>
                <p className="text-nowrap">
                  {t("agency.properties.forRent")} {">"}
                </p>
              </div>
              <div className="cursor-pointer rounded-md bg-blue-950 p-2 text-sm text-white">
                <div className="mb-2 flex items-end gap-1">
                  <Store size={36} />
                  <div>
                    <p>{storesForRent.length}</p>
                    <p>{t("agency.properties.stores")}</p>
                  </div>
                </div>
                <p className="text-nowrap">
                  {t("agency.properties.forRent")} {">"}
                </p>
              </div>

              <div className="cursor-pointer rounded-md bg-blue-950 p-2 text-sm text-white">
                <div className="mb-2 flex items-end gap-1">
                  <House size={36} />
                  <div>
                    <p>{housesForSale.length}</p>
                    <p>{t("agency.properties.houses")}</p>
                  </div>
                </div>
                <p className="text-nowrap">
                  {t("agency.properties.forRent")} {">"}
                </p>
              </div>

              <div className="cursor-pointer rounded-md bg-blue-950 p-2 text-sm text-white">
                <div className="mb-2 flex items-end gap-1">
                  <p className="text-4xl font-semibold">
                    {agency._count.listings}
                  </p>
                </div>
                <p className="text-nowrap">
                  {t("agency.properties.allListings")} {">"}
                </p>
              </div>
            </div>
            <div className="my-3 text-slate-700">
              <p>{agency.address}</p>
              <p>{t("agency.contact.hours")}</p>
              <p>{agency.workHours}</p>
            </div>
            <div className="flex items-center gap-3">
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
      <div className="bg-blue-950 text-white">
        <PopularAgencyListings
          listings={agency.listings.slice(0, 8)}
          title={t("agency.properties.popularListings", {
            agencyName: agency.name,
          })}
        />
      </div>
    </main>
  );
}
