"use client";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check, CircleAlert, CircleCheck } from "lucide-react";
import { useState } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import Step7 from "./steps/Step7";
import Step8 from "./steps/Step8";
import { Button } from "@/components/ui/button";

const stepsComponents = [
  <Step1 />,
  <Step2 />,
  <Step3 />,
  <Step4 />,
  <Step5 />,
  <Step6 />,
  <Step7 />,
  <Step8 />,
];

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
  },
  {
    title: "Location",
    description: "Enter your location and address",
    fieldsMentioned: ["location"],
  },
  {
    title: "Main characteristics",
    description: "Set the price, area size and key features",
    fieldsMentioned: ["bedrooms", "bathrooms", "area", "price"],
  },
  {
    title: "Additional features & heating",
    description: "Fill in heating details and other information",
    fieldsMentioned: ["features", "heating"],
  },
  {
    title: "Description",
    description: "Describe the property in detail",
    fieldsMentioned: ["description"],
  },
  {
    title: "Photos and Video",
    description: "Add photos and video of the property",
    fieldsMentioned: ["photos", "video"],
  },
  {
    title: "Contact Details",
    description: "Enter contact details",
    fieldsMentioned: ["contact"],
  },
  {
    title: "Publish listing",
    description: "Complete and publish your listing",
    fieldsMentioned: [],
  },
];
export default function NewPage() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(5);
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
                <li
                  onClick={() => setCurrentStep(index + 1)}
                  key={step.title}
                  className={cn(
                    "flex p-4 pr-1 cursor-pointer hover:bg-gray-50",
                    currentStep === index + 1 &&
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
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="w-2/3">
        <div className="p-2 shadow-md bg-white mt-2 rounded">
          {stepsComponents[currentStep - 1]}
          <div>
            <Button size={"sm"} className="my-2">
              Submit
            </Button>
            <div className="flex gap-2">
              <Button
                disabled={currentStep === 1}
                size={"sm"}
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(currentStep - 1);
                  }
                }}
              >
                Prev
              </Button>
              <Button
                size={"sm"}
                disabled={currentStep === steps.length}
                onClick={() => {
                  if (currentStep < steps.length) {
                    setCurrentStep(currentStep + 1);
                  }
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
