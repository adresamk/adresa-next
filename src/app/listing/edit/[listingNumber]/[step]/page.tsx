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
  const { user } = await validateRequest();
  if (!user) {
    redirect("/signin?redirect=/listing/edit");
  }

  const listing = await prismadb.listing.findUnique({
    where: {
      listingNumber: Number(params.listingNumber),
    },
  });
  if (!listing) {
    redirect("/404");
  }

  const requestedStep = params.step;
  const stepExists = steps.find(
    (step: Step) => step.uniquePath === requestedStep
  );
  if (!stepExists) {
    redirect(
      `/listing/edit/${params.listingNumber}/${steps[0].uniquePath}`
    );
  }

  return (
    <div className="flex gap-2 p-2">
      <ListingEditForm
        listing={listing}
        requestedStep={requestedStep}
      />
    </div>
  );
}
