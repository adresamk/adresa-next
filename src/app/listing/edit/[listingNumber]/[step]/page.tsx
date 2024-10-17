import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import prismadb from "@/lib/db";
import ListingEditForm from "./ListingEditForm";
import { Step, steps } from "./types";

export default async function EditListingPage({
  params,
}: {
  params: { listingNumber: string; step: string };
}) {
  const requestedStep = params.step;
  const stepExists = steps.find(
    (step: Step) => step.uniquePath === requestedStep
  );
  const { user } = await validateRequest();
  if (!user) {
    redirect(
      `/signin?redirect=/listing/edit/${params.listingNumber}/${steps[0].uniquePath}`
    );
  }

  const listing = await prismadb.listing.findUnique({
    where: {
      listingNumber: Number(params.listingNumber),
    },
  });
  if (!listing) {
    redirect("/404");
  }

  // check if user owns the listing
  if (listing.userId !== user.id) {
    return <div>You don't own this one |change on launch| </div>;
  }

  if (!stepExists) {
    redirect(
      `/listing/edit/${params.listingNumber}/${steps[0].uniquePath}`
    );
  }

  return (
    <div className="flex gap-2 p-2">
      <ListingEditForm
        loadedListing={listing}
        requestedStep={requestedStep}
      />
    </div>
  );
}
