import { deleteListing } from "@/server/actions/listing.actions";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";

export default function ListingDeleteButton({
  listingId,
}: {
  listingId: number;
}) {
  const t = useTranslations();
  return (
    <ConfirmDeleteButton
      onDelete={async () => {
        const resp = await deleteListing(listingId);
        if (resp.success) {
          // router.refresh();
        }
      }}
      icon={<Trash className="h-4 w-4 text-red-500" />}
      deleteText={t("common.actions.delete")}
      className="ml-auto text-sm md:text-base"
    />
  );
}
