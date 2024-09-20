import { cn } from "@/lib/utils";
import { Listing } from "@prisma/client";
import Image from "next/image";
import {
  ArrowDown,
  Bath,
  Bed,
  Crown,
  EyeOff,
  Heart,
  ImageIcon,
  LampFloor,
  Mail,
  MapPin,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { formatNumberWithDelimiter } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ListingsSearchShowcase({
  listing,
}: {
  listing: Listing;
}) {
  const missingImage = "/assets/missing-image.jpg";
  return (
    <Link key={listing.id} href={"/listing/" + listing.listingNumber}>
      <li
        key={listing.id}
        className={cn(
          "",
          listing.isPaidPromo && "border border-brand-light-blue"
        )}
      >
        <article className="w-full mb-5">
          <div className="w-full rounded-lg flex relative overflow-hidden bg-white border-solid border drop-shadow transition-all ease-linear">
            <figure className="my-0 mx-auto block">
              {/* image header */}
              <div className="absolute top-0 left-0 w-full flex items-center py-2.5 px-3.5 pointer-events-none overflow-hidden">
                <div className="text-white flex items-center gap-1.5">
                  <ImageIcon size={14} />
                  <span className="font-bold">
                    {listing.images.length}
                  </span>
                </div>
                <div>
                  {/* Place to use tags when we have them */}
                  {/* {listing.tags} */}
                </div>
              </div>
              <div className="w-[260px] h-[240px]">
                <Image
                  src={listing.mainImage || missingImage}
                  width={260}
                  height={240}
                  alt="Property first image"
                />
              </div>
              <figcaption className="hidden">
                {listing.type}, {listing.area}m²
              </figcaption>
            </figure>
            <div className="flex-1 px-5 pt-3.5 pb-2.5">
              <div className="flex flex-col justify-between h-full">
                <div className="max-w-full mb-2">
                  <h3 className="text-lg leading-6 font-medium mb-1.5 overflow-hidden">
                    <span className="capitalize">{listing.type}</span>
                    , {listing.area}m²
                  </h3>
                  <h3 className="text-xs leading-5 mb-2.5 overflow-hidden">
                    {listing.manucipality || "Municipality"}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-5 mb-2.5 overflow-hidden">
                    {listing.description}
                  </p>

                  {/* Extras/features */}
                  <div className="flex gap-6">
                    <ul className="flex gap-1">
                      <li
                        title="Floor"
                        className="text-xs tracking-tighter flex items-center"
                      >
                        <LampFloor width={17} height={17} />
                        <span>{listing.floorNumber}</span>
                      </li>
                      <li
                        title="Bedrooms"
                        className="text-xs tracking-tighter flex items-center"
                      >
                        <Bed width={17} height={17} />
                        <span>{listing.bedrooms} br</span>
                      </li>
                      <li
                        title="Bathrooms"
                        className="text-xs tracking-tighter flex items-center"
                      >
                        <Bath width={17} height={17} />
                        <span>{listing.bathrooms} ba</span>
                      </li>
                    </ul>
                    <p className="text-xs ">
                      <span className="text-gray-500">Updated: </span>
                      <time
                        dateTime={listing.updatedAt
                          .toISOString()
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("/")}
                      >
                        {listing.updatedAt
                          .toISOString()
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("/")}
                      </time>
                    </p>
                  </div>
                </div>
                <div className="mt-auto max-w-full">
                  <div className="flex items-center mb-1.5">
                    <p className="font-bold leading-4 tracking-tighter text-xl">
                      €{listing.price}
                    </p>
                  </div>
                  <div className="flex">
                    {/* labels */}
                    <div className="flex gap-1">
                      {listing.isPaidPromo && (
                        <span
                          title="Featured Listing"
                          className="border inline-block p-0.5 rounded items-center gap-1.5 text-xs  shadow-sm"
                        >
                          <Crown size={16} />
                        </span>
                      )}

                      {listing.locationPrecision === "exact" && (
                        <span
                          title="Exact location on map"
                          className="border inline-block p-0.5 rounded items-center gap-1.5 text-xs shadow-sm"
                        >
                          <MapPin size={16} />
                        </span>
                      )}
                    </div>
                    {/* actions */}
                    <div className="ml-auto">
                      <ul className="flex gap-1">
                        <li>
                          <Button
                            variant="ghost"
                            className="w-10 h-10 px-0.5 text-brand-light-blue hover:text-brand-dark-blue"
                          >
                            <EyeOff className="w-5 h-5" />
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="ghost"
                            className="w-10 h-10 px-0.5 text-brand-light-blue hover:text-brand-dark-blue"
                          >
                            <Heart />
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="ghost"
                            className="w-10 h-10 px-0.5 text-brand-light-blue hover:text-brand-dark-blue"
                          >
                            <Mail />
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </li>
    </Link>
  );
}
