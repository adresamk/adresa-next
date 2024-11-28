import Container from "@/components/shared/Container";
import RevealButton from "@/components/shared/RevealButton";
import { House, Store } from "lucide-react";
import PopularAgencyProperties from "./PopularAgencyProperties";
import prismadb from "@/lib/db";
import { getTranslations } from "next-intl/server";

export default async function AgencyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations();
  
  const agency = await prismadb.agency.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!agency) {
    return <div>{t("agency.notFound")}</div>;
  }

  return (
    <main className="min-h-screen">
      <div
        style={{
          background: "url('/assets/agency-logo.png') no-repeat right ",
        }}
        className="relative"
      >
        <div className="absolute top-0.5 h-full min-h-[300px] w-full backdrop-blur-md"></div>

        <Container>
          {/* Hero */}
          <div className="relative z-10 flex w-2/3 flex-col justify-center">
            <div className="mb-5 flex gap-3">
              <div className="flex items-center justify-center rounded-xl border border-slate-400 bg-white px-5 py-4">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={agency.logoUrl || ""} alt={agency.name || ""} />
              </div>
              <div className="flex flex-col justify-between py-2">
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
                    <p>{5}</p>
                    <p>{t("agency.properties.apartments")}</p>
                  </div>
                </div>
                <p className="text-nowrap">{t("agency.properties.forSale")} {">"}</p>
              </div>
              <div className="cursor-pointer rounded-md bg-blue-950 p-2 text-sm text-white">
                <div className="mb-2 flex items-end gap-1">
                  <Store size={36} />
                  <div>
                    <p>{5}</p>
                    <p>{t("agency.properties.stores")}</p>
                  </div>
                </div>
                <p className="text-nowrap">{t("agency.properties.forSale")} {">"}</p>
              </div>

              <div className="cursor-pointer rounded-md bg-blue-950 p-2 text-sm text-white">
                <div className="mb-2 flex items-end gap-1">
                  <House size={36} />
                  <div>
                    <p>{5}</p>
                    <p>{t("agency.properties.buildings")}</p>
                  </div>
                </div>
                <p className="text-nowrap">{t("agency.properties.forRent")} {">"}</p>
              </div>
              <div className="cursor-pointer rounded-md bg-blue-950 p-2 text-sm text-white">
                <div className="mb-2 flex items-end gap-1">
                  <House size={36} />
                  <div>
                    <p>{6}</p>
                    <p>{t("agency.properties.buildings")}</p>
                  </div>
                </div>
                <p className="text-nowrap">{t("agency.properties.forRent")} {">"}</p>
              </div>
              <div className="cursor-pointer rounded-md bg-blue-950 p-2 text-sm text-white">
                <div className="mb-2 flex items-end gap-1">
                  <p className="text-4xl font-semibold">{5}</p>
                </div>
                <p className="text-nowrap">{t("agency.properties.allListings")} {">"}</p>
              </div>
            </div>
            <div className="my-3 text-slate-700">
              <p>{agency.address}</p>
              <p>{t("agency.contact.hours")}</p>
              <p>{agency.workHours}</p>
            </div>
            <div>
              <RevealButton usecase="website" value={agency.website ?? ""} />
              <RevealButton
                usecase="phone"
                value={agency.contactPersonPhone ?? ""}
              />
            </div>
          </div>
        </Container>

        {/* Popular Agency Properties */}
      </div>
      <div className="bg-blue-950 px-10">
        <Container>
          <PopularAgencyProperties
            properties={[]}
            title={t("agency.properties.popularListings", { agencyName: agency.name })}
          />
        </Container>
      </div>
    </main>
  );
}
