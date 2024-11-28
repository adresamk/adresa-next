import { deleteListing } from "@/server/actions/listing.actions";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function ListingDeleteButton({
  listingId,
}: {
  listingId: string;
}) {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        const result = await deleteListing(formData);
      }}
    >
      <Button
        variant={"ghost"}
        size={"sm"}
        className="px-2 text-xs text-red-400 hover:text-red-600"
      >
        <Trash className="mr-2" /> Delete
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
