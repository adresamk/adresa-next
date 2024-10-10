"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { SubmitHandler, useForm } from "react-hook-form";
interface ListingEditFormProps {
  loadedListing: Listing;
  requestedStep: string;
}

import { z } from "zod";
import { useFormState } from "react-dom";
import { editListing, EditListingResponse } from "./actions";

// const EditListingSchema = z.object({
//   propertyType: z.string(),
//   listingId: z.string(),
//   step: z.string(),
// });

// type EditListingSchemaType = z.infer<typeof EditListingSchema>;
export default function ListingEditForm({
  loadedListing,
  requestedStep,
}: ListingEditFormProps) {
  const [listing, setListing] = useState(loadedListing);
  const [state, formAction] = useFormState(editListing, {
    success: true,
    data: {
      listing: loadedListing,
    },
  });
  const { data, success, error } = state;

  console.log(data);
  //   const listing = data ? data.listing : loadedListing;

  const [currentStep, setCurrentStep] = useState(requestedStep);
  const [progress, setProgress] = useState(22);
  const stepsFlow = steps.map((step) => step.uniquePath);
  const currentStepIdx = stepsFlow.indexOf(currentStep);

  useEffect(() => {
    console.log("something returned", state);
    if (state.data && state.data.listing) {
      //   @ts-ignore
      setListing(state.data.listing);
    }
  }, [state]);

  return (
    <>
      <div>MANU {listing.manucipality || "Nema"}</div>
      <div>PRICE {listing.price || "Nema"}</div>
      <ListingEditSideMenu
        currentStep={currentStep}
        listing={listing}
        setCurrentStep={setCurrentStep}
        progress={progress}
      />
      <div className="w-2/3">
        <div className="p-2 shadow-md bg-white mt-2 rounded">
          <form
            action={formAction}
            // onSubmit={(e) => {
            //   e.preventDefault();
            //   console.log(e);
            //   const fd = new FormData(e.target as HTMLFormElement);
            //   const obj = Object.fromEntries(fd);
            //   console.log(obj);
            //   //   handleSubmit(onSubmit);
            // }}
          >
            <input
              type="text"
              className="hidden"
              defaultValue={listing.id}
              name="listingId"
            />
            {currentStepIdx === 0 && (
              <Step1 listing={listing} key={"1"} />
            )}
            {currentStepIdx === 1 && (
              <Step2 listing={listing} key={"2"} />
            )}
            {currentStepIdx === 2 && (
              <Step3 listing={listing} key={"3"} />
            )}
            {currentStepIdx === 3 && (
              <Step4 listing={listing} key={"4"} />
            )}
            {currentStepIdx === 4 && (
              <Step5 listing={listing} key={"5"} />
            )}
            {currentStepIdx === 5 && (
              <Step6 listing={listing} key={"6"} />
            )}
            {currentStepIdx === 6 && (
              <Step7 listing={listing} key={"7"} />
            )}
            {currentStepIdx === 7 && (
              <Step8 listing={listing} key={"8"} />
            )}
            {/* {stepsComponents[currentStepIdx]} */}
            <Button size={"sm"} className="my-2" type="submit">
              Submit
            </Button>
          </form>
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
