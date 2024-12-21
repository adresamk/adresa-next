import { Listing } from "@prisma/client";
import ListingMapCard from "./ListingMapCard";

export default function ActiveListing({
  listing,
}: {
  listing: Listing | null;
}) {
  if (!listing) {
    return null;
  }
  return <ListingMapCard listing={listing} />;
}
