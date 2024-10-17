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
import { redirect } from "next/navigation";
import MiniContactForm from "./_components/MiniContactForm";
import RevealButton from "@/components/shared/RevealButton";
import { formatNumberWithDelimiter } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/db";
import { ListingContactData } from "@/lib/types";

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
  const listing = await prismadb.listing.findUnique({
    where: {
      listingNumber: Number(params.listingNumber),
    },
  });

  const contactData: ListingContactData = JSON.parse(
    listing?.contactData || "{}"
  );

  if (!listing) {
    redirect("/404");
  }
  return (
    <div className="p-4">
      SingleListing works
      <div className="flex items-center">
        <Button className="mr-10" variant={"ghost"}>
          Back
        </Button>

        <div>
          Home sales {">"} Skopje, Centar {">"} Stanovi {">"} Listing
          {listing.listingNumber}
        </div>
      </div>
      {/* Images */}
      <div className="flex gap-3 relative mb-5">
        <div className="absolute bottom-1 right-1 flex gap-2 bg-slate-300/90 p-1 rounded items-center cursor-pointer">
          <PictureInPicture2 size={16} /> +{" "}
          {/* 5 are already shown */}
          {listing.images.length - 5}
        </div>
        <div className="w-1/2">
          <img
            src={listing.mainImage || ""}
            alt="Main image"
            className="w-full h-full rounded"
          />
        </div>
        <div className="w-1/2 grid grid-cols-2 gap-3">
          {listing.images.slice(1, 5).map((imageUrl, idx) => (
            <img
              key={idx}
              src={imageUrl}
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
              <p>{listing.address}</p>
            </div>
            <div>
              <RevealButton
                variant="outline"
                usecase="phone"
                value={contactData.phone || ""}
              />
              <p className="text-sm">
                Posted on{" "}
                {listing.publishedAt
                  ? listing.publishedAt.toDateString()
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xl">
                <span className="font-semibold ">
                  {formatNumberWithDelimiter(
                    listing.price ? listing.price.toString() : ""
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
                  <tbody>
                    <tr>
                      <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                        Price
                      </td>
                      <td className="px-2 font-semibold text-black border border-slate-600">
                        {formatNumberWithDelimiter(
                          listing.price
                            ? listing.price.toString()
                            : ""
                        )}
                        $
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                        Price per m2
                      </td>
                      <td className="px-2 font-semibold text-black border border-slate-600">
                        {listing.price &&
                          listing.area &&
                          formatNumberWithDelimiter(
                            Math.round(
                              listing.price / listing.area
                            ).toString()
                          )}
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
                        {listing.floorNumber}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                        Kat
                      </td>
                      <td className="px-2 font-semibold text-black border border-slate-600">
                        {listing.floorNumber} (од вкупно 7)
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                        Kitchen
                      </td>
                      <td className="px-2 font-semibold text-black border border-slate-600">
                        {listing.kitchens}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                        Bathroom
                      </td>
                      <td className="px-2 font-semibold text-black border border-slate-600">
                        {listing.bathrooms}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                        Garage/Parking
                      </td>
                      <td className="px-2 font-semibold text-black border border-slate-600">
                        {listing.parking} Parking
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                        Year Made
                      </td>
                      <td className="px-2 font-semibold text-black border border-slate-600">
                        {"Year Made 2023"}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                        Posted Date
                      </td>
                      <td className="px-2 font-semibold text-black border border-slate-600">
                        {listing.publishedAt?.toDateString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                        Last Modified
                      </td>
                      <td className="px-2 font-semibold text-black border border-slate-600">
                        {listing.updatedAt?.toDateString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-[150px] border border-slate-600 py-2 text-center px-2 bg-gray-200 text-slate-600 ">
                        Post Number
                      </td>
                      <td className="px-2 font-semibold text-black border border-slate-600">
                        {listing.listingNumber}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <div className="flex gap-2 items-center my-3">
                  Inside <Separator />
                </div>

                <div className="flex gap-3 items-center px-2">
                  {/* Add Inside features */}
                </div>

                <div className="flex gap-2 itemsce my-3">
                  Outside <Separator />
                </div>

                <div className="flex gap-3 items-center px-2">
                  {/* Add outside features */}
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-3 bg-slate-400" />

          <div>
            <h3 className="text-lg font-semibold mb-3">Location</h3>
            <p className="my-3 text-2xl">{listing.address}</p>
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
                    value={contactData.phone || ""}
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
