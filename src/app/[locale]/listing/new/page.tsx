import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CircleAlert, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import InitialStep from "./InitialStep";

import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { addNewListing } from "@/server/actions/listing.actions";

type StepStatus = {
  [key: string]: "completed" | "incomplete" | "in-progress";
};
type Step = {
  title: string;
  description: string;
  fieldsMentioned: string[];
};
const stepStatus: StepStatus = {
  "Property Category": "completed",
};
const initialStep: Step = {
  title: "Property Category",
  description: "Select the category",
  fieldsMentioned: ["category"],
};

export default async function NewPage() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/signin?redirect=/listing/new");
  }

  const progress = 10;
  return (
    <div className="flex gap-2 p-2">
      <div className="w-1/3">
        <div className="m-2 rounded bg-white shadow-md">
          <div className="p-2">
            <p>
              <span>{progress}%</span> completed{" "}
            </p>
            <p>New Listing</p>

            <div className="mt-4">
              <Progress value={progress} />
            </div>
          </div>
          <Separator className="mt-2" />
          <div>
            <ul>
              <li
                key={initialStep.title}
                className={cn(
                  "flex cursor-pointer border-l-4 border-l-brand-light-blue bg-gray-50 p-4 pr-1 hover:bg-gray-50",
                )}
              >
                <div className="flex-1">
                  <p>{initialStep.title}</p>
                  <p className="text-sm text-gray-500">
                    {initialStep.description}
                  </p>
                </div>
                <div className="flex items-center px-2">
                  {stepStatus[initialStep.title] === "completed" && (
                    <CircleCheck fill="green" />
                  )}

                  {stepStatus[initialStep.title] === "in-progress" && (
                    <CircleCheck fill="orange" />
                  )}

                  {stepStatus[initialStep.title] === "incomplete" && (
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
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const result = await addNewListing(formData);
              if (result && result.error) {
                // Handle error (e.g., show a notification)
              }
            }}
          >
            <InitialStep />
            <Button size={"sm"} className="my-2">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
