import Container from "@/components/shared/Container";
import RevealButton from "@/components/shared/RevealButton";
import { House, Store } from "lucide-react";
import PopularAgencyProperties from "./PopularAgencyProperties";

const agency = {
  name: "Agency Martin",
  logo: "/assets/agency-logo.png",
  location: "Скопје, ул. Партизански одреди бр.42 3/5",
  contactPerson: "Stole stolevski",
  workHours: "Пон - Петок 09:00 - 17:00",
  mapLocation: "",
  description:
    "Ние сме водечка агенција за недвижнини која нуди професионални услуги во купување, продавање и изнајмување на имоти. Со нашиот тим од искусни агенти, Ви обезбедуваме целосна поддршка и насоки низ целиот процес. Посветени сме на прецизно исполнување на Вашите желби и потреби, обезбедувајќи сигурни и транспарентни трансакции. Нашето портфолио вклучува широк спектар на резиденцијални и комерцијални објекти, прилагодени на секој буџет и стил. Дозволете ни да Ви помогнеме да го најдете идеалниот дом или инвестиција.",
  shortDescription: "agencija za nedviznosti",
  selling: [
    {
      type: "apartment",
    },
    {
      type: "business",
    },
  ],
  renting: [
    {
      type: "object-building",
    },
    {
      type: "object-key",
    },
  ],
  listings: [{}, {}],
  properties: [
    {
      id: 1,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 200000,
      mode: "sale",
      tags: ["new", "featured"],
      location: "Skope, Centar",
      liked: true,
    },
    {
      id: 2,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 200000,
      mode: "rent",
      tags: ["new"],
      location: "Skope, Centar",

      liked: false,
    },
    {
      id: 3,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 200000,

      mode: "sale",
      tags: [],
      location: "Skope, Centar",

      liked: false,
    },
    {
      id: 4,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 1_000,
      mode: "sale",
      tags: [],
      location: "Skope, Centar",

      liked: false,
    },
    {
      id: 5,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 200000,
      mode: "sale",
      tags: [],
      location: "Skope, Centar",

      liked: false,
    },
    {
      id: 6,
      images: ["/assets/demo-property-bg.png"],
      type: "Apartment",
      area: "60m²",
      price: 200000,
      mode: "sale",
      tags: [],
      location: "Skope, Centar",

      liked: false,
    },
  ],
};
export default function AgencyPage() {
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
                <img src={agency.logo} alt="Agency Logo" />
              </div>
              <div className="flex flex-col justify-between py-2 ">
                <p>{agency.shortDescription}</p>
                <h3 className="text-4xl font-semibold tracking-widest">
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
                        agency.selling.filter(
                          (property) => property.type === "apartment"
                        ).length
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
                      {
                        agency.selling.filter(
                          (property) => property.type === "business"
                        ).length
                      }
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
                        agency.renting.filter(
                          (property) =>
                            property.type === "object-building"
                        ).length
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
                        agency.selling.filter(
                          (property) => property.type === "object-key"
                        ).length
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
                    {agency.listings.length}
                  </p>
                </div>
                <p className="text-nowrap">site oglasi {">"}</p>
              </div>
            </div>
            <div className="my-3 text-slate-700">
              <p>{agency.location}</p>
              <p>Hours: {agency.workHours}</p>
            </div>
            <div>
              <RevealButton
                usecase="website"
                value="www.google.com"
              />
              <RevealButton usecase="phone" value="077 777 777" />
            </div>
          </div>
        </Container>

        {/* Polular Agency Properties */}
      </div>
      <div className="bg-blue-950 px-10">
        <Container>
          <PopularAgencyProperties
            // bgColor="bg-slate-800"
            properties={agency.properties}
            title={"Najpopularni oglasi od " + agency.name}
          />
        </Container>
      </div>
      <Container>
        <div className="flex items-center">
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold ">{agency.name}</h3>
            <p className="text-slate-500">{agency.location}</p>
            <p className="text-slate-500">Working hours</p>
            <p className="font-semibold">{agency.workHours}</p>
            <p className="text-slate-500">Contact person</p>
            <p className="font-semibold">{agency.contactPerson}</p>
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
