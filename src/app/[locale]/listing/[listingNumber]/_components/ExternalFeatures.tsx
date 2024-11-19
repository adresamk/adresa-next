import { SerializedListing } from "@/lib/types";
import { Listing } from "@prisma/client";

export default function ExternalFeatures({
  listing,
}: {
  listing: SerializedListing;
}) {
  return <div>ExternalFeatures works</div>;
}
