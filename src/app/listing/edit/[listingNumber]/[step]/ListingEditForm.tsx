"use client";
import { Listing } from "@prisma/client";
import ListingEditSideMenu from "./_components/ListingEditSideMenu";
import Link from "next/link";
import EditForm from "./_components/EditForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { steps } from "./types";

interface ListingEditFormProps {
  listing: Listing;
  requestedStep: string;
}
export default function ListingEditForm({
  listing,
  requestedStep,
}: ListingEditFormProps) {
  const [currentStep, setCurrentStep] = useState(requestedStep);
  const [progress, setProgress] = useState(22);
  const stepsFlow = steps.map((step) => step.uniquePath);
  const currentStepIdx = stepsFlow.indexOf(currentStep);
  return (
    <>
      <ListingEditSideMenu
        currentStep={currentStep}
        listing={listing}
        setCurrentStep={setCurrentStep}
        progress={progress}
      />
      <div className="w-2/3">
        <div className="p-2 shadow-md bg-white mt-2 rounded">
          <EditForm
            listing={listing}
            currentStepIdx={currentStepIdx}
          />
          <div>
            <div className="flex gap-2">
              <Button
                disabled={currentStep === "category"}
                size={"sm"}
                onClick={() => {
                  setCurrentStep(
                    steps[currentStepIdx - 1]?.uniquePath
                  );
                }}
              >
                Prev
              </Button>
              <Button
                disabled={currentStep === "publish"}
                size={"sm"}
                onClick={() => {
                  setCurrentStep(
                    steps[currentStepIdx + 1]?.uniquePath
                  );
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
