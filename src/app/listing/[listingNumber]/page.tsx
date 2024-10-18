import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
      {/* Images */}
      <section className="mx-auto w-full max-w-7xl px-5">
        <ListingImages listing={listing} />
      </section>
      {/* Main section with Info */}
      <section className="mx-auto w-full px-5 lg:max-w-5xl">
        <div className="flex flex-wrap">
          {/* Listing Main */}

          <div className="flex-1 px-6 py-2 md:mr-2.5 lg:mr-12">
            {/* Title */}
            <div className="flex">
              <div className="flex-1 pr-7">
                <h1 className="pt-4 text-xl font-semibold md:pt-2 md:text-3xl">
                  {listing.title}
                </h1>
                <p className="pt-2 text-sm tracking-tight md:text-base">
                  {listing.address}
                </p>
              </div>
              <div className="max-w-[230px] flex-shrink-0 flex-grow-0">
                <div className="">
                  <RevealButton
                    variant="outline"
                    usecase="phone"
                    value={contactData.phone || ""}
                  />
                  <p className="mt-2.5 text-sm">
                    Posted on{" "}
                    {listing.publishedAt
                      ? listing.publishedAt.toDateString()
                      : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
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
              <div className="flex gap-2">
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
            <Separator className="my-3 bg-slate-400" />
            <div className="flex items-center justify-between px-3">
              <span>Moznost za kreditiranje</span>
              <Button>
                <Percent /> Check now !
              </Button>
            </div>
            <Separator className="my-3 bg-slate-400" />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Description</h3>
              <p className="text-lg text-slate-500">{listing.description}</p>
            </div>

            <Separator className="my-3 bg-slate-400" />

            <div className="px-2">
              <h3 className="mb-3 text-lg font-semibold">Characteristics</h3>
              <div>
                <div>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Price
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {formatNumberWithDelimiter(
                            listing.price ? listing.price.toString() : "",
                          )}
                          $
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Price per m2
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {listing.price &&
                            listing.area &&
                            formatNumberWithDelimiter(
                              Math.round(
                                listing.price / listing.area,
                              ).toString(),
                            )}
                          $
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Area
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {listing.area} m2
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Floors
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {listing.floorNumber}
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Kat
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {listing.floorNumber} (од вкупно 7)
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Kitchen
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {listing.kitchens}
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Bathroom
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {listing.bathrooms}
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Garage/Parking
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {listing.parking} Parking
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Year Made
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {"Year Made 2023"}
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Posted Date
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {listing.publishedAt?.toDateString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Last Modified
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {listing.updatedAt?.toDateString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="w-[150px] border border-slate-600 bg-gray-200 px-2 py-2 text-center text-slate-600">
                          Post Number
                        </td>
                        <td className="border border-slate-600 px-2 font-semibold text-black">
                          {listing.listingNumber}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <div className="my-3 flex items-center gap-2">
                    Inside <Separator />
                  </div>

                  <div className="flex items-center gap-3 px-2">
                    {/* Add Inside features */}
                  </div>

                  <div className="itemsce my-3 flex gap-2">
                    Outside <Separator />
                  </div>

                  <div className="flex items-center gap-3 px-2">
                    {/* Add outside features */}
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-3 bg-slate-400" />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Location</h3>
              <p className="my-3 text-2xl">{listing.address}</p>
              <div>
                <img src="/assets/google-map-location.png" alt="" />
              </div>
            </div>
            <Separator className="my-3 bg-slate-400" />

            <div>
              <h3 className="mb-3 text-lg font-semibold">Posted By</h3>
              <div className="flex gap-2">
                <div className="flex items-center justify-center rounded-xl border border-slate-400 bg-slate-100 px-8 py-4">
                  <img src="/assets/agency-logo.png" alt="" />
                </div>
                <div>
                  <div className="mb-5">
                    <p>realestate agency</p>
                    <h3 className="text-xl font-semibold">Agency Marting</h3>
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
          {/* Listing Sidebar */}
          <div className="w-1/3 max-w-full flex-shrink-0 pt-9 md:w-[330px] lg:w-[380px]">
            <MiniContactForm listing={listing} />
          </div>
        </div>
        {/* Publisher (Agency) Details */}
        <div className="mt-10 flex flex-wrap md:mt-14"></div>
      </section>
    </article>
  );
}
