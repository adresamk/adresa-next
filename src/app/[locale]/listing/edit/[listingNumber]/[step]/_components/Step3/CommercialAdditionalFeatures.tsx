import { ListingWithRelations } from "@/types/listing.types";
import { Feature, Listing } from "@prisma/client";

interface CommercialAdditionalFeaturesProps {
  listing: Listing;
  allCategoryFeatures: Feature[];
}
export default function CommercialAdditionalFeatures({
  listing: basicTypedListing,
  allCategoryFeatures,
}: CommercialAdditionalFeaturesProps) {
  const lwr = basicTypedListing as ListingWithRelations;
  const listing = {
    ...lwr,
    commercial: lwr.commercial!,
  };
  return <>CommercialAdditionalFeatures works</>;
}
