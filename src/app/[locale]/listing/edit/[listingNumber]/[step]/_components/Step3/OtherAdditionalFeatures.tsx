import { ListingWithRelations } from "@/types/listing.types";
import { Feature, Listing } from "@prisma/client";

interface OtherAdditionalFeaturesProps {
  listing: Listing;
  allCategoryFeatures: Feature[];
}
export default function OtherAdditionalFeatures({
  listing: basicTypedListing,
  allCategoryFeatures,
}: OtherAdditionalFeaturesProps) {
  const lwr = basicTypedListing as ListingWithRelations;
  const listing = {
    ...lwr,
    commercial: lwr.commercial!,
  };
  return <>OtherAdditionalFeatures works</>;
}
