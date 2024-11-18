import { redirect } from "next/navigation";

export default async function EditListingWithoutStep({
  params,
}: {
  params: Promise<{ listingNumber: string }>;
}) {
  const { listingNumber } = await params;
  redirect(`/listing/edit/${listingNumber}/category`);
}
