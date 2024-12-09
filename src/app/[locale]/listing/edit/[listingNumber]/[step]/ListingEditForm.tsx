"use client";
import { Listing } from "@prisma/client";
import ListingEditSideMenu from "./_components/ListingEditSideMenu";
import Step1 from "./steps/Step1";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step2 from "./steps/Step2";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import Step7 from "./steps/Step7";
import Step8 from "./steps/Step8";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { steps } from "./types";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { editListing } from "@/server/actions/listing.actions";
import { useTranslations } from "next-intl";

interface ListingEditFormProps {
  loadedListing: Listing;
  requestedStep: string;
}

export default function ListingEditForm({
  loadedListing,
  requestedStep,
}: ListingEditFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(editListing, {
    // initial state if needed
    success: false,
  });
  const { data, success, error } = state;
  const t = useTranslations();
  const initialValue = data ? data.listing : loadedListing;
  const [listing, setListing] = useState(initialValue);
  // TODO, this doesnt update

  const [currentStep, setCurrentStep] = useState(requestedStep);
  const [progress, setProgress] = useState(22);
  const stepsFlow = steps.map((step) => step.uniquePath);
  const currentStepIdx = stepsFlow.indexOf(currentStep);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget); // Get form data
    const { success, error, data } = await editListing(
      { success: false },
      formData,
    );
    if (success && data) {
      setListing(data.listing);
      setCurrentStep(steps[currentStepIdx + 1]?.uniquePath);
      window.history.pushState(
        {},
        "",
        `${window.location.pathname.split("/").slice(0, -1).join("/")}/${steps[currentStepIdx + 1].uniquePath}`,
      );
    } else {
      console.log("error", error);
    }
  }

  return (
    <>
      <ListingEditSideMenu
        currentStep={currentStep}
        listing={listing}
        setCurrentStep={setCurrentStep}
        progress={progress}
      />
      <div className="min-w-[460px] pl-10">
        <div className="mt-2 rounded bg-white p-2 shadow-md">
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="hidden"
              defaultValue={listing.id}
              name="listingId"
            />
            {currentStepIdx === 0 && <Step1 listing={listing} key={"1"} />}
            {currentStepIdx === 1 && <Step2 listing={listing} key={"2"} />}
            {currentStepIdx === 2 && <Step3 listing={listing} key={"3"} />}
            {currentStepIdx === 3 && <Step4 listing={listing} key={"4"} />}
            {currentStepIdx === 4 && <Step5 listing={listing} key={"5"} />}
            {currentStepIdx === 5 && <Step6 listing={listing} key={"6"} />}
            {currentStepIdx === 6 && <Step7 listing={listing} key={"7"} />}
            {currentStepIdx === 7 && <Step8 listing={listing} key={"8"} />}
            {/* {stepsComponents[currentStepIdx]} */}

            <Button size={"sm"} className="my-2" type="submit">
              {t("common.actions.saveChanges")}
            </Button>
          </form>
          {/* <div>
            <div className="flex gap-2">
              <Button
                disabled={currentStep === "category"}
                size={"sm"}
                onClick={() => {
                  setCurrentStep(steps[currentStepIdx - 1]?.uniquePath);
                }}
              >
                Prev
              </Button>
              <Button
                disabled={currentStep === "publish"}
                size={"sm"}
                onClick={() => {
                  setCurrentStep(steps[currentStepIdx + 1]?.uniquePath);
                }}
              >
                Next
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
