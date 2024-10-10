import Step1 from "../steps/Step1";
import Step3 from "../steps/Step3";
import Step4 from "../steps/Step4";
import Step2 from "../steps/Step2";
import Step5 from "../steps/Step5";
import Step6 from "../steps/Step6";
import Step7 from "../steps/Step7";
import Step8 from "../steps/Step8";
import { Button } from "@/components/ui/button";
import { editListing } from "../actions";
import { Listing } from "@prisma/client";
interface EditFormProps {
  listing: Listing;
  currentStepIdx: number;
}
export default function EditForm({
  listing,
  currentStepIdx,
}: EditFormProps) {
  return (
    <form action={editListing}>
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
      <Button size={"sm"} className="my-2">
        Submit
      </Button>
    </form>
  );
}
