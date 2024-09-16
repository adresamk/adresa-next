import { redirect } from "next/navigation";

export default function EditListingWithoutStep({
  params,
}: {
  params: { listingNumber: string };
}) {
  redirect(`/listing/edit/${params.listingNumber}/category`);
}
