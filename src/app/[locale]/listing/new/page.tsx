import { Button } from "@/components/ui/button";
import InitialStep from "./InitialStep";

import { redirect } from "next/navigation";
import { createNewListing } from "@/server/actions/listing.actions";
import { getCurrentUser } from "@/lib/sessions";
import { getTranslations } from "next-intl/server";
import { initialSteps } from "../edit/[listingNumber]/[step]/types";
import ListingNewSideMenu from "./_components/ListingNewSideMenu";

type StepStatus = {
  [key: string]: "completed" | "incomplete" | "in-progress";
};
type Step = {
  title: string;
  key: string;
  description: string;
  fieldsMentioned: string[];
};
const stepStatus: StepStatus = {
  "property.category": "completed",
};
// const initialStepTranslated: Step = {
//   title: "Property Category",
//   description: "Select the category",
//   fieldsMentioned: ["category"],
// };

export default async function NewListingPage() {
  const { account } = await getCurrentUser();

  const t = await getTranslations();
  if (!account) {
    redirect("/signin?redirect=/listing/new");
  }

  // const progress = 10;
  return (
    <div className="flex gap-2 p-2">
      <ListingNewSideMenu steps={initialSteps} />
      <div className="w-2/3">
        <div className="mt-2 rounded bg-white p-2 shadow-md">
          <form
            // action={addNewListing}
            action={async (formData: FormData) => {
              "use server";
              const result = await createNewListing(formData);
              console.log(result);
              if (result && result.error) {
                // Handle error (e.g., show a notification)
              }
            }}
          >
            <InitialStep />
            <Button size={"sm"} className="my-2">
              {t("listing.new.actions.next")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
