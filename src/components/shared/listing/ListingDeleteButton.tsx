import { deleteListing } from "@/server/actions/listing.actions";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ListingDeleteButton({
  listingId,
}: {
  listingId: number;
}) {
  const t = useTranslations();
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await deleteListing(formData);
      }}
    >
      <Button
        variant={"ghost"}
        size={"sm"}
        className="px-2 text-xs text-red-400 hover:text-red-600"
      >
        <Trash className="mr-2" /> {t("common.actions.delete")}
      </Button>
      <input
        type="text"
        className="hidden"
        name="listingId"
        defaultValue={listingId}
      />
    </form>
  );
}
