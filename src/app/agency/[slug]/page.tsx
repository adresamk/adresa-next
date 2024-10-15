import Container from "@/components/shared/Container";
import RevealButton from "@/components/shared/RevealButton";
import { House, Store } from "lucide-react";
import PopularAgencyProperties from "./PopularAgencyProperties";
import prismadb from "@/lib/db";

export default async function AgencyPage({
  params,
}: {
  params: { slug: string };
}) {
  const agency = await prismadb.agency.findUnique({
    where: {
      slug: params.slug,
    },
  });
  console.log(agency);
  if (!agency) {
    return <div>Agency not found</div>;
  }

  return (
    <main className=" min-h-screen ">
      <div
        style={{
          background:
            "url('/assets/agency-logo.png') no-repeat right ",
        }}
        className="relative"
      >
        <div className="backdrop-blur-md absolute  top-0.5 h-full min-h-[300px] w-full "></div>

        <Container>
          {/* Hero */}
          <div className="relative z-10 w-2/3 flex flex-col justify-center">
            <div className="flex gap-3 mb-5">
              <div className="py-4 px-5 bg-white border border-slate-400 rounded-xl flex items-center justify-center">
                <img src={agency.logoUrl || ""} alt="Agency Logo" />
              </div>
              <div className="flex flex-col justify-between py-2 ">
                <p>{agency.shortDescription}</p>
                <h3 className="text-4xl font-semibold">
                  {agency.name}
                </h3>
              </div>
            </div>
            <p>{agency.description}</p>
            <div className="flex gap-3 my-7">
              <div className="text-white text-sm p-2 bg-blue-950 rounded-md cursor-pointer">
                <div className="flex gap-1 items-end mb-2 ">
                  <House size={36} />
                  <div>
                    <p>
                      {
                        // agency.selling.filter(
                        //   (property) => property.type === "apartment"
                        // ).length
                        5
                      }
                    </p>
                    <p>stanovi</p>
                  </div>
                </div>
                <p className="text-nowrap">za prodazba {">"}</p>
              </div>
              <div className="text-white text-sm p-2 bg-blue-950 rounded-md cursor-pointer">
                <div className="flex gap-1 items-end mb-2 ">
                  <Store size={36} />
                  <div>
                    <p>
                      {/* {
                        agency.selling.filter(
                          (property) => property.type === "business"
                        ).length
                      } */}
                      5
                    </p>
                    <p>Dukani</p>
                  </div>
                </div>
                <p className="text-nowrap">za prodazba {">"}</p>
              </div>

              <div className="text-white text-sm p-2 bg-blue-950 rounded-md cursor-pointer">
                <div className="flex gap-1 items-end mb-2 ">
                  <House size={36} />
                  <div>
                    <p>
                      {
                        // agency.renting.filter(
                        //   (property) =>
                        //     property.type === "object-building"
                        // ).length
                        5
                      }
                    </p>
                    <p>Objekti</p>
                  </div>
                </div>
                <p className="text-nowrap">za iznajmuvanje {">"}</p>
              </div>
              <div className="text-white text-sm p-2 bg-blue-950 rounded-md cursor-pointer">
                <div className="flex gap-1 items-end mb-2 ">
                  <House size={36} />
                  <div>
                    <p>
                      {
                        // agency.selling.filter(
                        //   (property) => property.type === "object-key"
                        // ).length
                        6
                      }
                    </p>
                    <p>Objekti</p>
                  </div>
                </div>
                <p className="text-nowrap">za iznajmuvanje {">"}</p>
              </div>
              <div className="text-white text-sm p-2 bg-blue-950 rounded-md cursor-pointer">
                <div className="flex gap-1 items-end mb-2 ">
                  <p className="text-4xl font-semibold">
                    {/* {agency.listings.length} */}
                    {5}
                  </p>
                </div>
                <p className="text-nowrap">All listings {">"}</p>
              </div>
            </div>
            <div className="my-3 text-slate-700">
              <p>{agency.address}</p>
              <p>Hours</p>
              <p>{agency.workHours}</p>
            </div>
            <div>
              <RevealButton
                usecase="website"
                value={agency.website ?? ""}
              />
              <RevealButton
                usecase="phone"
                value={agency.contactPersonPhone ?? ""}
              />
            </div>
          </div>
        </Container>

        {/* Polular Agency Properties */}
      </div>
      <div className="bg-blue-950 px-10">
        <Container>
          <PopularAgencyProperties
            // bgColor="bg-slate-800"
            // properties={agency.properties}
            properties={[]}
            title={"Najpopularni oglasi od " + agency.name}
          />
        </Container>
      </div>
      <Container>
        <div className="flex items-center">
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold ">{agency.name}</h3>
            <p className="text-slate-500">{agency.address}</p>
            <p className="text-slate-500">Working hours</p>
            <p className="font-semibold">{agency.workHours}</p>
            <p className="text-slate-500">Contact person</p>
            <p className="font-semibold">
              {agency.contactPersonFullName}
            </p>
            <div>
              <RevealButton usecase="phone" value="078-344-223" />
            </div>
          </div>
          <div className="flex i">
            <img
              className=""
              src="/assets/google-map-location.png"
              alt="Map location"
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
