import { adjustListingVisibility } from "@/server/actions/listing.actions";
import { Button } from "@/components/ui/button";
import { Listing } from "@prisma/client";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
export default function ListingVisibilityButton({
  listing,
}: {
  listing: Listing;
}) {
  const t = useTranslations();
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await adjustListingVisibility(formData);
      }}
    >
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
          <Eye className="mr-2" /> {t("common.actions.show")}
        </Button>
      )}

      {listing.isVisible && (
        <Button variant={"ghost"} size={"sm"} className="px-2 text-xs">
          <EyeOff className="mr-2" /> {t("common.actions.hide")}
        </Button>
      )}
    </form>
  );
}
