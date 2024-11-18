import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import prismadb from "@/lib/db";
import ListingEditForm from "./ListingEditForm";
import { Step, steps } from "./types";

type Params = Promise<{ listingNumber: string; step: string }>;

export default async function EditListingPage({ params }: { params: Params }) {
  const { listingNumber, step: requestedStep } = await params;

  const stepExists = steps.find(
    (step: Step) => step.uniquePath === requestedStep,
  );
  const { user } = await validateRequest();
  if (!user) {
    redirect(
      `/signin?redirect=/listing/edit/${listingNumber}/${steps[0].uniquePath}`,
    );
  }

  const listing = await prismadb.listing.findUnique({
    where: {
      listingNumber: Number(listingNumber),
    },
  });
  if (!listing) {
    redirect("/404");
  }

  // check if user owns the listing
  if (listing.userId !== user.id) {
    return <div>You don&apost own this one |change on launch| </div>;
  }

  if (!stepExists) {
    redirect(`/listing/edit/${listingNumber}/${steps[0].uniquePath}`);
  }

  return (
    <div className="flex gap-2 p-2">
      <ListingEditForm loadedListing={listing} requestedStep={requestedStep} />
    </div>
  );
}
