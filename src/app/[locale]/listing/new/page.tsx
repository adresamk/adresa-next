import InitialStep from "./InitialStep";

import { redirect } from "@/i18n/routing";
import { createNewListing } from "@/server/actions/listing.actions";
import { getCurrentUser } from "@/lib/sessions";
import { getLocale, getTranslations } from "next-intl/server";
import { initialSteps } from "../edit/[listingNumber]/[step]/types";
import ListingNewSideMenu from "./_components/ListingNewSideMenu";
import { SubmitButton } from "@/components/SubmitButton";
import { Metadata } from "next";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  title: {
    default: "Нов оглас | Adresa.mk",
    template: "%s | Adresa.mk",
  },
  description: "Креирање на нов оглас за Adresa.mk",
};

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
  const [{ account }, locale, t] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getTranslations(),
  ]);

  if (!account) {
    redirect({
      href: "/signin?redirect=/listing/new",
      locale: locale,
    });
  }

  // const progress = 10;
  return (
    <div className="flex gap-2 p-2">
      <Suspense fallback={<div>Loading...</div>}>
        <ListingNewSideMenu steps={initialSteps} />
      </Suspense>
      <div className="min-w-[460px]">
        <div className="mt-2 rounded bg-white p-2 shadow-md">
          <Suspense fallback={<div>Loading...</div>}>
            <form
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
              <SubmitButton
                size={"sm"}
                className="my-2"
                defaultText={t("common.actions.next")}
                loadingText={t("common.actions.creating")}
              />
            </form>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
