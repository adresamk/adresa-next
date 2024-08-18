import { SelectDemo } from "@/components/shared/SelectDemo";
import { cx } from "class-variance-authority";
import {
  ArrowDown,
  Crown,
  Image,
  Mail,
  MapPin,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
import { Listing } from "@/global/types";

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

interface ListingListProps {
  title: string;
  listings: any[];
}
export default function ListingsList({
  title,
  listings,
}: ListingListProps) {
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
      <ul className="">
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
                    <Heart fill={listing.isLiked ? "blue" : "none"} />
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
