import InitialStep from "./InitialStep";

import { createNewListing } from "@/server/actions/listing.actions";
import { getTranslations } from "next-intl/server";
import { SubmitButton } from "@/components/SubmitButton";
import { Metadata } from "next";
// export const dynamic = "force-dynamic";
export async function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}
// we know that the form is static, so we don't need to revalidate it
export const revalidate = false;

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
  const [t] = await Promise.all([getTranslations()]);

  // const progress = 10;
  return (
    <div className="mt-2 rounded bg-white p-2 shadow-md">
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
          defaultText={t("common.actions.start")}
          loadingText={t("common.actions.creating")}
        />
      </form>
    </div>
  );
}
