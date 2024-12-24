import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import InitialStep from "./InitialStep";

import { redirect } from "next/navigation";
import { createNewListing } from "@/server/actions/listing.actions";
import { getCurrentUser } from "@/lib/sessions";
import { getTranslations } from "next-intl/server";

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

  const initialStepTranslated: Step = {
    key: "property.category",
    title: t("listing.new.propertyCategory"),
    description: t("listing.new.selectCategory"),
    fieldsMentioned: ["category"],
  };
  const stepStatusTranslated: StepStatus = {
    [initialStepTranslated.title]: "completed",
  };

  const progress = 10;
  return (
    <div className="flex gap-2 p-2">
      <div className="w-1/3">
        <div className="m-2 rounded bg-white shadow-md">
          <div className="p-2">
            <p>
              <span>{progress}%</span> {t("listing.new.inProgress")}{" "}
            </p>
            <p>{t("listing.new.newListing")}</p>

            <div className="mt-4">
              <Progress value={progress} />
            </div>
          </div>
          <Separator className="mt-2" />
          <div>
            <ul>
              <li
                key={initialStepTranslated.title}
                className={cn(
                  "flex cursor-pointer border-l-4 border-l-brand-light-blue bg-gray-50 p-4 pr-1 hover:bg-gray-50",
                )}
              >
                <div className="flex-1">
                  <p>{initialStepTranslated.title}</p>
                  <p className="text-sm text-gray-500">
                    {initialStepTranslated.description}
                  </p>
                </div>
                <div className="flex items-center px-2">
                  {stepStatus[initialStepTranslated.key] === "completed" && (
                    <CircleCheck fill="green" />
                  )}

                  {stepStatus[initialStepTranslated.key] === "in-progress" && (
                    <CircleCheck fill="orange" />
                  )}

                  {stepStatus[initialStepTranslated.key] === "incomplete" && (
                    <CircleAlert fill="red" />
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
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
