import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CircleAlert, CircleCheck } from "lucide-react";
import { Listing } from "@prisma/client";
import Link from "next/link";
import { steps, Step, stepStatus } from "../types";

interface ListingEditSideMenuProps {
  currentStep: string;
  progress: number;
  listing: Listing;
  setCurrentStep: (step: string) => void;
}
export default function ListingEditSideMenu({
  currentStep,
  progress,
  listing,
  setCurrentStep,
}: ListingEditSideMenuProps) {
  return (
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
                key={step.title}
                onClick={() => {
                  setCurrentStep(steps[index].uniquePath);
                }}
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
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
