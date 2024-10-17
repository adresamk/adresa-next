import { adjustListingVisibility } from "@/actions/listings";
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
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-xs  px-2"
        >
          <Eye className="mr-2" /> Show
        </Button>
      )}

      {listing.isVisible && (
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-xs  px-2"
        >
          <EyeOff className="mr-2" /> Hide
        </Button>
      )}
    </form>
  );
}
