import { ListingWithRelations } from "@/types/listing.types";
import { Listing } from "@prisma/client";
import UserContactInfo from "../_components/Step7/UserContactInfo";
import AgencyContactInfo from "../_components/Step7/AgencyContactInfo";

export default function Step7({ listing }: { listing: Listing }) {
  const lwr = listing as ListingWithRelations;

  const stepValue = lwr.user ? "user" : lwr.agency ? "agency" : "invalid-value";
  return (
    <div className="p-2">
      <input
        type="string"
        className="hidden"
        defaultValue={stepValue}
        name="step"
      />

      {lwr.user && <UserContactInfo user={lwr.user} />}
      {lwr.agency && <AgencyContactInfo agency={lwr.agency} />}
    </div>
  );
}
