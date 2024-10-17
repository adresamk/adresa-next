import { deleteListing } from "@/actions/listings";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function ListingDeleteButton({
  listingId,
}: {
  listingId: string;
}) {
  return (
    <form action={deleteListing}>
      <Button
        variant={"ghost"}
        size={"sm"}
        className="text-red-400 hover:text-red-600 text-xs px-2"
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
