import { Listing } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { displayPrice } from "@/lib/utils";
import LikeListingButton from "@/app/[locale]/search/_components/LikeListingButton";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Card className="max-w-[325px]">
      <CardHeader className="relative p-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing?.mainImage || ""}
          className="h-[200px] w-[325px] object-cover"
          alt=""
          width={325}
          height={200}
        />
        <div className="absolute bottom-2 left-2 flex gap-1 text-[10px]">
          {listing?.tags?.map((tag: string) => (
            <span
              key={tag}
              className="rounded-lg bg-white p-0.5 px-1.5 font-semibold uppercase text-brand-light-blue"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-2">
        <p>
          <span className="capitalize">{listing.type}</span>, {listing.area}m²
        </p>
        <p className="text-sm capitalize">{listing.municipality}</p>
      </CardContent>
      <CardFooter className="flex justify-around px-4 pb-3">
        <span>{displayPrice(listing.price)}</span>
        <span className="ml-auto">
          <LikeListingButton listingId={listing.id} />
        </span>
      </CardFooter>
    </Card>
  );
}
