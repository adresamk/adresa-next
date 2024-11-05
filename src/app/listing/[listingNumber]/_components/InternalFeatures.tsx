import { SerializedListing } from "@/lib/types";
import { Listing } from "@prisma/client";

export default function InternalFeatures({
  listing,
}: {
  listing: SerializedListing;
}) {
  return <div>InternalFeatuers works </div>;
}
