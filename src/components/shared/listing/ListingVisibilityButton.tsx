import { adjustListingVisibility } from "@/server/actions/listing.actions";
import { Button } from "@/components/ui/button";
import { Listing, ListingStatus } from "@prisma/client";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
export default function ListingVisibilityButton({
  listing,
}: {
  listing: Listing;
}) {
  const t = useTranslations();
  const isHidden =
    listing.status === ListingStatus.INACTIVE &&
    listing.substatus === "user_hidden";
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await adjustListingVisibility(formData);
        console.log(result);
      }}
    >
      <input
        className="hidden"
        type="text"
        name="isVisible"
        defaultValue={!isHidden ? "true" : "false"}
      />
      <input
        className="hidden"
        type="text"
        name="listingId"
        defaultValue={listing.id}
      />
      {isHidden && (
        <Button variant={"ghost"} size={"sm"} className="px-2 text-xs">
          <Eye className="mr-2" /> {t("common.actions.show")}
        </Button>
      )}

      {!isHidden && (
        <Button variant={"ghost"} size={"sm"} className="px-2 text-xs">
          <EyeOff className="mr-2" /> {t("common.actions.hide")}
        </Button>
      )}
    </form>
  );
}
