import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CircleAlert, CircleCheck } from "lucide-react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import Step7 from "./steps/Step7";
import Step8 from "./steps/Step8";
import { Button } from "@/components/ui/button";
import { editListing } from "./actions";
import Link from "next/link";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prismadb from "@/lib/db";

type StepStatus = {
  [key: string]: "completed" | "incomplete" | "in-progress";
};
type Step = {
  title: string;
  description: string;
  fieldsMentioned: string[];
  uniquePath: string;
};
const stepStatus: StepStatus = {
  "Property Category": "completed",
  Location: "completed",
  "Main characteristics": "in-progress",
  "Additional features & heating": "incomplete",
  Description: "incomplete",
  "Photos and Video": "incomplete",
  "Contact Details": "incomplete",
  "Publish listing": "incomplete",
};
const steps: Step[] = [
  {
    title: "Property Category",
    description: "Select the category",
    fieldsMentioned: ["category"],
    uniquePath: "category",
  },
  {
    title: "Location",
    description: "Enter your location and address",
    fieldsMentioned: ["location"],
    uniquePath: "location",
  },
  {
    title: "Main characteristics",
    description: "Set the price, area size and key features",
    fieldsMentioned: ["bedrooms", "bathrooms", "area", "price"],
    uniquePath: "characteristics",
  },
  {
    title: "Additional features & heating",
    description: "Fill in heating details and other information",
    fieldsMentioned: ["features", "heating"],
    uniquePath: "features",
  },
  {
    title: "Description",
    description: "Describe the property in detail",
    fieldsMentioned: ["description"],
    uniquePath: "description",
  },
  {
    title: "Photos and Video",
    description: "Add photos and video of the property",
    fieldsMentioned: ["photos", "video"],
    uniquePath: "media",
  },
  {
    title: "Contact Details",
    description: "Enter contact details",
    fieldsMentioned: ["contact"],
    uniquePath: "contact",
  },
  {
    title: "Publish listing",
    description: "Complete and publish your listing",
    fieldsMentioned: [],
    uniquePath: "publish",
  },
];
const stepsFlow = steps.map((step) => step.uniquePath);

export default async function EditListingPage({
  params,
}: {
  params: { id: string; step: string };
}) {
  const { user } = await validateRequest();
  if (!user) {
    cookies().set("signin-redirect", "/listing/edit");
    redirect("/signin");
  }

  const listing = await prismadb.listing.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!listing) {
    redirect("/404");
  }

  const progress = 22;
  const currentStep = params.step;
  const currentStepIdx = stepsFlow.indexOf(params.step);

  return (
    <div className="flex gap-2 p-2">
      <div className="w-1/3 ">
        <div className="shadow-md rounded  m-2 bg-white">
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
              {steps.map((step: Step, index) => (
                <Link
                  key={step.title}
                  href={`/listing/edit/${params.id}/${steps[index].uniquePath}`}
                >
                  <li
                    className={cn(
                      "flex p-4 pr-1 cursor-pointer hover:bg-gray-50",
                      currentStep === steps[index].uniquePath &&
                        "bg-gray-50 border-l-4 border-l-brand-light-blue"
                    )}
                  >
                    <div className="flex-1 ">
                      <p>{step.title}</p>
                      <p className="text-sm text-gray-500">
                        {step.description}
                      </p>
                    </div>
                    <div className="flex items-center px-2">
                      {stepStatus[step.title] === "completed" && (
                        <CircleCheck fill="green" />
                      )}

                      {stepStatus[step.title] === "in-progress" && (
                        <CircleCheck fill="orange" />
                      )}

                      {stepStatus[step.title] === "incomplete" && (
                        <CircleAlert fill="red" />
                      )}
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="w-2/3">
        <div className="p-2 shadow-md bg-white mt-2 rounded">
          <form action={editListing}>
            <input
              type="text"
              className="hidden"
              value={listing.id}
              name="listingId"
            />
            {currentStepIdx === 0 && (
              <Step1 listing={listing} key={"1"} />
            )}
            {currentStepIdx === 1 && (
              <Step2 listing={listing} key={"2"} />
            )}
            {currentStepIdx === 2 && <Step3 key={"3"} />}
            {currentStepIdx === 3 && <Step4 key={"4"} />}
            {currentStepIdx === 4 && <Step5 key={"5"} />}
            {currentStepIdx === 5 && <Step6 key={"6"} />}
            {currentStepIdx === 6 && <Step7 key={"7"} />}
            {currentStepIdx === 7 && <Step8 key={"8"} />}
            {/* {stepsComponents[currentStepIdx]} */}
            <Button size={"sm"} className="my-2">
              Submit
            </Button>
          </form>
          <div>
            <div className="flex gap-2">
              <Button
                disabled={currentStep === "category"}
                size={"sm"}
              >
                <Link
                  href={`/listing/edit/${params.id}/${
                    steps[currentStepIdx - 1]?.uniquePath
                  }`}
                >
                  Prev
                </Link>
              </Button>
              <Button
                disabled={currentStep === "publish"}
                size={"sm"}
              >
                <Link
                  href={`/listing/edit/${params.id}/${
                    steps[currentStepIdx + 1]?.uniquePath
                  }`}
                >
                  Next
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
