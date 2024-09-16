import { redirect } from "next/navigation";

export default function EditListingWithoutStep({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/listing/edit/${params.id}/category`);
}
