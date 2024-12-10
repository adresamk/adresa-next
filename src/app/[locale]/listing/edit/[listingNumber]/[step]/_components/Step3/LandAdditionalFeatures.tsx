import { ListingWithRelations } from "@/types/listing.types";
import { Feature, Listing } from "@prisma/client";

interface LandAdditionalFeaturesProps {
  listing: Listing;
  allFeatures: Feature[];
}
export default function LandAdditionalFeatures({
  listing: basicTypedListing,
  allFeatures,
}: LandAdditionalFeaturesProps) {
  const lwr = basicTypedListing as ListingWithRelations;
  const listing = {
    ...lwr,
    commercial: lwr.commercial!,
  };
  return <>LandAdditionalFeatures works</>;
}
