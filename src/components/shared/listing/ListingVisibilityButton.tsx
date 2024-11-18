import { adjustListingVisibility } from "@/server/actions/listing.actions";
import { Button } from "@/components/ui/button";
import { Listing } from "@prisma/client";
import { Eye, EyeOff } from "lucide-react";
export default function ListingVisibilityButton({
  listing,
}: {
  listing: Listing;
}) {
  return (
    <form action={adjustListingVisibility}>
      <input
        className="hidden"
        type="text"
        name="isVisible"
        defaultValue={listing.isVisible.toString()}
      />
      <input
        className="hidden"
        type="text"
        name="listingId"
        defaultValue={listing.id}
      />
      {!listing.isVisible && (
        <Button variant={"ghost"} size={"sm"} className="px-2 text-xs">
          <Eye className="mr-2" /> Show
        </Button>
      )}

      {listing.isVisible && (
        <Button variant={"ghost"} size={"sm"} className="px-2 text-xs">
          <EyeOff className="mr-2" /> Hide
        </Button>
      )}
    </form>
  );
}
