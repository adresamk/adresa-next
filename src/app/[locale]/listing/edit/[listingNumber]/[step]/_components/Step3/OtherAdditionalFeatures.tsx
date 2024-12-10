import { ListingWithRelations } from "@/types/listing.types";
import { Feature, Listing } from "@prisma/client";

interface OtherAdditionalFeaturesProps {
  listing: Listing;
  allFeatures: Feature[];
}
export default function OtherAdditionalFeatures({
  listing: basicTypedListing,
  allFeatures,
}: OtherAdditionalFeaturesProps) {
  const lwr = basicTypedListing as ListingWithRelations;
  const listing = {
    ...lwr,
    commercial: lwr.commercial!,
  };
  return <>OtherAdditionalFeatures works</>;
}
