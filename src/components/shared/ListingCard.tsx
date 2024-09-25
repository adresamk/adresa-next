import { Listing } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import LikeListingButton from "@/app/search/_components/LikeListingButton";
import { formatNumberWithDelimiter } from "@/lib/utils";

export default function ListingCard({
  listing,
}: {
  listing: Listing;
}) {
  return (
    <Card className="max-w-[325px]">
      <CardHeader className="relative p-0">
        <img
          src={listing?.mainImage || ""}
          className="w-full"
          alt=""
        />
        <div className="absolute flex bottom-2 left-2 gap-1 text-[10px]">
          {listing?.tags?.map((tag: string) => (
            <span
              key={tag}
              className="bg-white text-brand-light-blue p-0.5 font-semibold px-1.5 uppercase rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent
        className="
        px-4 pt-2"
      >
        <p>
          <span className="capitalize">{listing.type}</span>,{" "}
          {listing.area}m²
        </p>
        <p className="text-sm capitalize">{listing.manucipality}</p>
      </CardContent>
      <CardFooter className="pb-3 px-4 flex justify-around">
        <span>
          €
          {formatNumberWithDelimiter(listing.price?.toString() || "")}
        </span>
        <span className="ml-auto">
          <LikeListingButton
            listingId={listing.id}
            isFavorite={true}
          />
        </span>
      </CardFooter>
    </Card>
  );
}
