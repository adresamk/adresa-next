"use client";
import Filters from "@/components/shared/filters/Filters";
import { SelectDemo } from "@/components/shared/SelectDemo";
import { Button } from "@/components/ui/button";
import { cx } from "class-variance-authority";
import {
  ArrowDown,
  Crown,
  Image,
  Mail,
  MapPin,
  Repeat,
  User,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { list } from "postcss";
import { useState } from "react";
interface ListingListProps {
  title: string;
  listings: any[];
}

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
import { formatNumberWithDelimiter } from "@/lib/utils";
const icons: { [key: string]: JSX.Element } = {
  bathroom: <ShowerHead width={16} height={16} />,
  ac: <AirVentIcon width={16} height={16} />,
  garage: <House width={16} height={16} />,
  elevator: <DoorClosed />,
  alart: <AlarmCheck />,
  protectionDoor: <DoorOpen />,
  spajz: <DoorOpen />,
  terace: <Fence />,
  facade: <BrickWall />,
};
const sortingOptions = [
  { value: "new", label: "Newest" },
  { value: "lowPrice", label: "Lowest First" },
  { value: "highPrice", label: "Highest First" },
];
interface Listing {
  id: string;
  mainImage: string;
  imagesCount: number;
  type: string;
  area: number;
  oldPrice: number | null;
  price: number;
  mode: "sale" | "rent";
  tags: string[];
  location: string;
  postedAt: string;
  agency?: {
    logo: string;
    slug: string;
  };
  user?: {
    logo: string;
    id: string;
  };
  features: {
    [key: string]: number | undefined;
    bathroom?: number;
    ac?: number;
    garage?: number;
  };
  description: string;
  isLiked: boolean;
  isPaidPromo: boolean;
}
const listings: Listing[] = [
  {
    id: "id1",
    mainImage: "/assets/demo-property-bg.png",
    imagesCount: 15,
    type: "Apartment",
    area: 60,
    oldPrice: 55000,
    price: 50000,
    mode: "sale",
    tags: ["new", "featured"],
    location: "Skope, Centar",
    postedAt: "1 Jun 2024",
    agency: {
      logo: "/assets/agency-logo.png",
      slug: "slug",
    },
    features: {
      bathroom: 2,
      ac: 1,
      garage: 1,
    },
    description:
      "Se prodava 113m2 stan so 3 spalni i 3 kupatila vo Kapistec vo nova zgrada zavrsena 2024 godina. Stanot se naogja na visoko prizemje i moze da se koristi za ziveenje, no i kako kancelariski prostor..Vo zadniot del od zgradata ima platforma vo prodolzetok na stanot na koja moze da se napravi golema terasa/dvor.",
    isLiked: true,
    isPaidPromo: true,
  },
  {
    id: "id2",
    mainImage: "/assets/demo-property-bg.png",
    imagesCount: 15,
    type: "Apartment",
    area: 60,
    oldPrice: null,
    price: 50000,
    mode: "sale",
    tags: ["new", "featured"],
    location: "Skope, Centar",
    postedAt: "1 Jun 2024",
    user: {
      logo: "/assets/agency-logo.png",
      id: "someid",
    },
    features: {},
    description:
      "Se prodava 113m2 stan so 3 spalni i 3 kupatila vo Kapistec vo nova zgrada zavrsena 2024 godina. Stanot se naogja na visoko prizemje i moze da sekoristi za ziveenje, no i kako kancelariski prostor..Vo zadniot del od zgradata ima platforma vo prodolzetok na stanot na koja moze da se napravi golema terasa/dvor.",
    isLiked: false,
    isPaidPromo: false,
  },
  {
    id: "id3",
    mainImage: "/assets/demo-property-bg.png",
    imagesCount: 15,
    type: "Apartment",
    area: 60,
    oldPrice: 55000,
    price: 50000,
    mode: "sale",
    tags: ["new", "featured"],
    location: "Skope, Centar",
    postedAt: "1 Jun 2024",
    agency: {
      logo: "/assets/agency-logo.png",
      slug: "slug",
    },
    features: {},
    description:
      "Se prodava 113m2 stan so 3 spalni i 3 kupatila vo Kapistec vo nova zgrada zavrsena 2024 godina. Stanot se naogja na visoko prizemje i moze da se koristi za ziveenje, no i kako kancelariski prostor..Vo zadniot del od zgradata ima platforma vo prodolzetok na stanot na koja moze da se napravi golema terasa/dvor.",
    isLiked: false,
    isPaidPromo: false,
  },
];
function ListingList({ title, listings }: ListingListProps) {
  const loweredPriceListings = 2;
  const [sorting, setSorting] = useState("");
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <div className="flex items-center justify-between py-2.5">
        <div className="text-sm">
          <span>{listings.length} results</span> {"|"}{" "}
          {loweredPriceListings > 0 && (
            <span className="text-brand-light-blue cursor-pointer">
              {loweredPriceListings} results with lowered price
            </span>
          )}
        </div>
        <div>
          <SelectDemo
            placeholder="Sort"
            triggerWidth="100px"
            value={sorting}
            options={sortingOptions}
            onClick={(newValue) => {
              setSorting(newValue);
            }}
          />
        </div>
      </div>
      <ul>
        {listings.map((listing: Listing) => (
          <Link href={"/listing/" + listing.id}>
            <li
              key={listing.id}
              className={cx(
                "h-[200px] flex mb-4 rounded-md",
                listing.isPaidPromo &&
                  "border border-brand-light-blue"
              )}
            >
              <div className="w-[200px] relative">
                <div className="absolute top-1 left-1 flex text-slate-200 text-sm items-center">
                  <Image width={20} /> {listing.imagesCount}
                </div>
                <div className="absolute top-1 right-2 flex gap-1 ">
                  {listing.tags.map((t) => (
                    <div
                      key={t}
                      className="py-0.5 px-1 text-sm text-brand-light-blue bg-white/70 rounded "
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <img
                  src={listing.mainImage}
                  alt="Apartment photo"
                  className="w-full h-full bg-cover rounded"
                />
              </div>
              <div className="pl-2.5 pr-6 py-2 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="flex gap-3 my-2">
                      <span className="font-semibold">
                        {listing.type}, {listing.area} m2{" "}
                      </span>
                      {listing.isPaidPromo && <Crown />} <MapPin />{" "}
                    </h3>
                    <p className="mb-1">{listing.location}</p>
                    <p className="text-xs text-slate-500">
                      posted at {listing.postedAt}
                    </p>
                  </div>
                  {listing.agency && (
                    <div className="flex items-center justify-center bg-slate-100 border-slate-300 border rounded-lg py-2 px-4">
                      <img
                        width={50}
                        height={54}
                        src={listing.agency.logo}
                        alt={listing.agency.slug}
                      />
                    </div>
                  )}
                  {listing.user && (
                    <UserCircle width={43} height={43} />
                  )}
                </div>
                <div className="max-h-10 overflow-y-hidden break-words text-ellipsis my-1.5 font-light text-sm text-gray-500">
                  {listing.description}
                </div>
                <div className="flex gap-2.5">
                  {Object.keys(listing.features).map((feature) => (
                    <div className="flex gap-1 items-center justify-center ">
                      {icons[feature]}
                      <div className="text-sm font-light ">
                        <span className="mr-1">
                          {(listing.features[feature] ?? 0) > 1
                            ? listing.features[feature]
                            : null}
                        </span>
                        <span>{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-semibold text-xl">
                      {formatNumberWithDelimiter(
                        listing.price.toString()
                      )}
                      $
                    </span>
                    {listing.oldPrice && (
                      <span className="text text-gray-500/70 flex line-through">
                        <ArrowDown
                          stroke="green"
                          className="mx-1.5"
                        />
                        {formatNumberWithDelimiter(
                          listing.oldPrice.toString()
                        )}
                        $
                      </span>
                    )}
                    <span className="text-sm text-gray-600 ml-2">
                      {"|"}{" "}
                      {formatNumberWithDelimiter(
                        Math.round(
                          listing.price / listing.area
                        ).toString()
                      )}{" "}
                      $/m2
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Heart
                      fill={listing.isLiked ? "blue" : "none"}
                      stroke="none"
                    />
                    <Mail />
                  </div>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
function Listings() {
  return (
    <div className="w-9/12 border px-6">
      <div className="flex items-center justify-between py-3">
        <div className="text-sm">
          <span>Prodazba na stanovi</span> {">"}{" "}
          <span>Skopje, Centar</span>
        </div>
        <Button
          variant={"outline"}
          size={"sm"}
          className="border-brand-light-blue text-brand-light-blue hover:text-brand-dark-blue"
        >
          {" "}
          <Repeat className="mr-2" />{" "}
          <span className="text-lg">Rent</span>
        </Button>
      </div>

      <ListingList
        title="Stanovi: Skopje, Centar"
        listings={listings}
      />
    </div>
  );
}

function Map() {
  return <div className="w-5/12 border">Map </div>;
}
export default function SearchPage() {
  return (
    <div className="bg-white">
      <Filters />
      <div className="flex">
        <Listings />
        {/* <Map /> */}
      </div>
    </div>
  );
}
