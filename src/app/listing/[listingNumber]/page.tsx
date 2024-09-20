"use client";
import { Button } from "@/components/ui/button";
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
import { useParams } from "next/navigation";
import MiniContactForm from "./_components/MiniContactForm";
import RevealButton from "@/components/shared/RevealButton";
import { formatNumberWithDelimiter } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
const images = [
  {
    url: "/assets/demo-property-bg.png",
    isMain: true,
    position: 1,
  },
  {
    url: "/assets/demo-property-bg.png",
    isMain: false,
    position: 2,
  },
  {
    url: "/assets/demo-property-bg.png",
    isMain: false,
    position: 3,
  },
  {
    url: "/assets/demo-property-bg.png",
    isMain: false,
    position: 4,
  },
  {
    url: "/assets/demo-property-bg.png",
    isMain: false,
    position: 5,
  },
  {
    url: "/assets/demo-property-bg.png",
    isMain: false,
    position: 6,
  },
];
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
export default function SingleListing() {
  const { listingNumber } = useParams();
  const listing = {
    title: "Stan, 60m2",
    location: "Skopje, Centar",
    phone: "077 777 777",
    postedDate: "1 Jun 2024",
    price: 50_000,
    area: 55,
    floors: 3,
    yearMade: "2020",
    lastModified: "20 07 2024",
    features: {
      bathroom: 2,
      ac: 1,
      garage: 1,
      kitchen: 1,
    },
    inside: {
      ac: 1,
      elevator: 1,
      alart: 1,
      protectionDoor: 1,
      spajz: 1,
    },
    outside: {
      terace: 1,
      facade: 1,
    },
    description: `Se prodava 113m2 stan so 3 spalni i 3 kupatila vo Kapistec vo nova zgrada zavrsena 2024 godina.Stanot se naogja na visoko prizemje i moze da se koristi za ziveenje, no i kako kancelariski prostor..Vo zadniot del od zgradata ima platforma vo prodolzetok na stanot na koja moze da se napravi golema terasa/dvor.Site materijali koristeni kako vrati, prozori, parket, plocki, sanitarija se od najvisok kvalitet.Greenjeto i ladenjeto e reseno so toplotna pumpa, resenie koe e najpogodno za efikasnost, ekonomicnost i niski smetki za struja.Stanot se naogja na mirna lokacija, na slepata ulica Sharski Odredi br. 3.Parkiranjeto e reseno so nalepnici na POC za stanarite na opstina Centar.Poseduva cist imoten list.`,
  };
  return (
    <div className="p-4">
      SingleListing works
      <div className="flex items-center">
        <Button className="mr-10" variant={"ghost"}>
          Back
        </Button>

        <div>
          Home sales {">"} Skopje, Centar {">"} Stanovi {">"} Listing{" "}
          {listingNumber}{" "}
        </div>
      </div>
      {/* Images */}
      <div className="flex gap-3 relative mb-5">
        <div className="absolute bottom-1 right-1 flex gap-2 bg-slate-300/90 p-1 rounded items-center cursor-pointer">
          <PictureInPicture2 size={16} /> + {images.length - 5}
        </div>
        <div className="w-1/2">
          <img
            src={images[0].url}
            alt="Main image"
            className="w-full h-full rounded"
          />
        </div>
        <div className="w-1/2 grid grid-cols-2 gap-3">
          {images.slice(1, 5).map((image) => (
            <img
              key={image.position}
              src={image.url}
              alt="Room image"
              className="rounded"
            />
          ))}
        </div>
      </div>
      <div className="flex">
        <div className="w-2/3 pl-2 pr-4">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-xl font-semibold">{listing.title}</p>
              <p>{listing.location}</p>
            </div>
            <div>
              <RevealButton
                variant="outline"
                usecase="phone"
                value={listing.phone}
              />
              <p className="text-sm">
                Posted on {listing.postedDate}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xl">
                <span className="font-semibold ">
                  {formatNumberWithDelimiter(
                    listing.price.toString()
                  )}{" "}
                  ${" "}
                </span>
                <span>| </span>
                <span className="text-slate-400">
                  {Math.round(listing.price / listing.area)} $/m2
                </span>
              </div>
              <div className="flex gap-3">
                {Object.keys(listing.features).map((feature) => (
                  <div
                    key={feature}
                    className="flex flex-col items-center justify-center"
                  >
                    {icons[feature]}
                    <div className="text-sm">
                      3
                      {/* {listing.features[feature] > 1
                        ? listing.features[feature]
                        : null}{" "} */}
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col gap-2 items-center">
                <Heart />
                favourite
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Share />
                share
              </div>
            </div>
          </div>
          <Separator className="my-3 bg-slate-400" />
          <div className="flex justify-between items-center px-3">
            <span>Moznost za kreditiranje</span>
            <Button>
              {" "}
              <Percent /> Check now !
            </Button>
          </div>
          <Separator className="my-3 bg-slate-400" />

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Description
            </h3>
            <p className="text-slate-500 text-lg">
              {listing.description}
            </p>
          </div>

          <Separator className="my-3 bg-slate-400" />

          <div className="px-2">
            <h3 className="text-lg font-semibold mb-3">
              Characteristics
            </h3>
            <div>
              <div>
                <table className="w-full">
                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Price
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      {formatNumberWithDelimiter(
                        listing.price.toString()
                      )}{" "}
                      $
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Price per m2
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      {formatNumberWithDelimiter(
                        Math.round(
                          listing.price / listing.area
                        ).toString()
                      )}{" "}
                      $
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Area
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      {listing.area} m2
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Floors
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      {listing.floors}
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Kat
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      5 (од вкупно 7)
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Kitchen
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      {listing.features.kitchen}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Bathroom
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      {listing.features.bathroom}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Garage/Parking
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      {listing.features.garage} Parking
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Year Made
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      {listing.yearMade}
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Posted Date
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      {listing.postedDate}
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Last Modified
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      {listing.lastModified}
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                      Post Number
                    </td>
                    <td className="px-2 font-semibold text-black border border-slate-600">
                      {listingNumber}
                    </td>
                  </tr>
                </table>
              </div>

              <div>
                <div className="flex gap-2 items-center my-3">
                  Inside <Separator />
                </div>

                <div className="flex gap-3 items-center px-2">
                  {Object.keys(listing.inside).map((feature) => (
                    <div
                      key={feature}
                      className="flex flex-col items-center justify-center"
                    >
                      {icons[feature]}
                      <div className="text-sm">
                        3
                        {/* {listing.inside[feature] > 1
                          ? listing.inside[feature]
                          : null}{" "} */}
                        {feature}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 itemsce my-3">
                  Outside <Separator />
                </div>

                <div className="flex gap-3 items-center px-2">
                  {Object.keys(listing.outside).map((feature) => (
                    <div
                      key={feature}
                      className="flex flex-col items-center justify-center"
                    >
                      {icons[feature]}
                      <div className="text-sm">
                        3
                        {/* {listing.outside[feature] > 1
                          ? listing.outside[feature]
                          : null}{" "} */}
                        {feature}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-3 bg-slate-400" />

          <div>
            <h3 className="text-lg font-semibold mb-3">Location</h3>
            <p className="my-3 text-2xl">{listing.location}</p>
            <div>
              <img src="/assets/google-map-location.png" alt="" />
            </div>
          </div>
          <Separator className="my-3 bg-slate-400" />

          <div>
            <h3 className="text-lg font-semibold mb-3">Posted By</h3>
            <div className="flex gap-2">
              <div className="flex items-center justify-center bg-slate-100 rounded-xl border border-slate-400 py-4 px-8">
                <img src="/assets/agency-logo.png" alt="" />
              </div>
              <div>
                <div className="mb-5">
                  <p>realestate agency</p>
                  <h3 className="text-xl font-semibold">
                    Agency Marting
                  </h3>
                  <p>Скопје, ул. Партизански одреди бр.42 3/5</p>
                </div>
                <div>
                  <p>Контакт период: 9 - 16 часот</p>
                  <RevealButton
                    usecase="phone"
                    value={listing.phone}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <MiniContactForm />
        </div>
      </div>
    </div>
  );
}
