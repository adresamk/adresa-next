import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  capitalizeString,
  cn,
  formatNumberWithDelimiter,
} from "@/lib/utils";
import { CircleAlert, CircleCheck } from "lucide-react";
import { Listing } from "@prisma/client";
import { steps, Step, StepStatus } from "../types";

interface ListingEditSideMenuProps {
  currentStep: string;
  progress: number;
  listing: Listing;
  setCurrentStep: (step: string) => void;
}
interface stepsValueSystemType {
  [key: string]: {
    [fieldName: string]: number;
  };
}
const stepsValueSystem: stepsValueSystemType = {
  "Property Type": {
    type: 100,
  },
  Location: {
    manucipality: 20,
    place: 20,
    district: 20,
    address: 20,
    latitude: 10,
    longitude: 10,
  },
  "Main characteristics": {
    price: 20,
    area: 20,
    floorNumber: 5,
    orientation: 5,
    bedrooms: 5,
    bathrooms: 5,
    wcs: 5,
    kitchens: 5,
    livingRooms: 5,
    parking: 5,
    elevator: 5,
    balcony: 5,
    yard: 5,
    basement: 5,
  },
  "Additional features & heating": {},
  Description: {
    description: 32,
    mkdDescription: 33,
    albDescription: 33,
  },
  "Photos and Video": {
    images: 50,
    videoLink: 50,
  },
  "Contact Details": {
    firstName: 20,
    lastName: 20,
    phone: 20,
    contactHours: 20,
    email: 20,
  },
  "Publish listing": {
    isPublished: 100,
  },
};
function calculateStepStatus(listing: Listing): StepStatus {
  let statuses: StepStatus = {};
  for (const step of steps) {
    if (step.title === "Property Type") {
      if (listing.type) {
        statuses[step.title] = "completed";
      } else {
        statuses[step.title] = "incomplete";
      }
    }
    if (step.title === "Location") {
      // manucipality: 20,
      // place: 20,
      // district: 20,
      // address: 20,
      if (
        !listing.manucipality &&
        !listing.place &&
        !listing.district &&
        !listing.address
      ) {
        statuses[step.title] = "incomplete";
      }

      if (
        listing.manucipality &&
        listing.place &&
        listing.district &&
        listing.address
      ) {
        statuses[step.title] = "completed";
      } else {
        statuses[step.title] = "in-progress";
      }
    }
    if (step.title === "Main characteristics") {
      if (!listing.price && !listing.area) {
        console.log(1);
        statuses[step.title] = "incomplete";
      }

      if (listing.price && listing.area) {
        console.log(2);

        statuses[step.title] = "completed";
      } else {
        console.log(3);

        statuses[step.title] = "in-progress";
      }
    }
    if (step.title === "Additional features & heating") {
      statuses[step.title] = "none";
    }
    if (step.title === "Description") {
      // description: 32,
      // mkdDescription: 33,
      // albDescription: 33,
      if (
        listing.description &&
        listing.mkdDescription &&
        listing.albDescription
      ) {
        statuses[step.title] = "completed";
      } else {
        statuses[step.title] = "none";
      }
    }
    if (step.title === "Photos and Video") {
      if (
        listing.images &&
        listing.images.length > 0 &&
        listing.videoLink
      ) {
        statuses[step.title] = "completed";
      } else {
        statuses[step.title] = "none";
      }
    }
    if (step.title === "Contact Details") {
      const contactData = JSON.parse(listing.contactData as string);
      if (
        !contactData.firstName &&
        !contactData.lastName &&
        !contactData.phone &&
        !contactData.email
      ) {
        statuses[step.title] = "incomplete";
      }
      if (
        contactData.firstName &&
        contactData.lastName &&
        contactData.phone &&
        contactData.email
      ) {
        statuses[step.title] = "completed";
      } else {
        statuses[step.title] = "in-progress";
      }
    }
    if (step.title === "Publish listing") {
      if (
        Object.values(statuses).includes("incomplete") ||
        Object.values(statuses).includes("in-progress")
      ) {
        statuses[step.title] = "in-progress";
      }
    }
  }
  return statuses;
}
type StepDescription = {
  [key: string]: string;
};
function generateStepDescriptions(listing: Listing): StepDescription {
  const descriptions: StepDescription = {};
  for (const step of steps) {
    if (step.title === "Property Type") {
      let properties = [];
      if (listing.category) {
        properties.push(listing.category);
      }
      if (listing.type) {
        properties.push(listing.type);
      }
      descriptions[step.title] = properties.length
        ? properties.map(capitalizeString).join(", ")
        : step.description;
    }
    if (step.title === "Location") {
      let properties = [];
      if (listing.manucipality && listing.place && listing.district) {
        properties.push(listing.district);
        properties.push(listing.place);

        descriptions[step.title] = properties.length
          ? properties.map(capitalizeString).join(", ")
          : step.description;
      }
    }
    if (step.title === "Main characteristics") {
      let properties = [];

      if (listing.price && listing.area) {
        properties.push(
          formatNumberWithDelimiter(listing.price.toString()) + " €"
        );
        properties.push(listing.area + " m²");

        descriptions[step.title] = properties.length
          ? properties.map(capitalizeString).join(", ")
          : step.description;
      }
    }
    if (step.title === "Additional features & heating") {
      descriptions[step.title] =
        "Fill in heating details and other information";
    }
    if (step.title === "Description") {
      let properties = [];
      if (listing.description) {
        properties.push(listing.description);

        descriptions[step.title] = properties.length
          ? properties.map(capitalizeString).join(", ")
          : step.description;
      }
    }
    if (step.title === "Photos and Video") {
      let properties = [];

      if (listing.images && listing.images.length > 0) {
        properties.push(listing.images.length + " images");
      }
      if (listing.videoLink) {
        properties.push("YouTube video");
      }

      descriptions[step.title] = properties.length
        ? properties.map(capitalizeString).join(", ")
        : step.description;
    }
    if (step.title === "Contact Details") {
      const contactData = JSON.parse(listing.contactData as string);
      if (contactData.email) {
        descriptions[step.title] = contactData.email;
      } else {
        descriptions[step.title] = step.description;
      }
    }
    if (step.title === "Publish listing") {
      descriptions[step.title] = step.description;
    }
  }
  return descriptions;
}
export default function ListingEditSideMenu({
  currentStep,
  progress,
  listing,
  setCurrentStep,
}: ListingEditSideMenuProps) {
  const stepsProgress = steps.map((step) => {
    let stepProgress = Object.entries(
      stepsValueSystem[step.title] || {}
    )
      .map(([key, value]) => {
        if (listing.hasOwnProperty(key)) {
          if (
            !listing[key as keyof Listing] ||
            (Array.isArray(listing[key as keyof Listing]) &&
              (listing[key as keyof Listing] as any[]).length === 0)
          ) {
            return 0;
          } else {
            return value;
          }
        }
      })
      .reduce((acc, curr) => acc! + curr!, 0);

    if (step.title === "Contact Details") {
      const contactData = JSON.parse(listing.contactData as string);
      stepProgress = Object.entries(
        stepsValueSystem[step.title] || {}
      )
        .map(([key, value]) => {
          if (contactData.hasOwnProperty(key)) {
            if (
              contactData[key as string] === null ||
              contactData[key as string] === undefined ||
              contactData[key as string] === ""
            ) {
              return 0;
            } else {
              return value;
            }
          }
        })
        .reduce((acc, curr) => acc! + curr!, 0);
    }
    return stepProgress;
  });

  const stepsProgressSum = stepsProgress.reduce(
    (acc, curr) => acc! + curr!,
    0
  )!;
  const formProgress = Math.round((stepsProgressSum / 800) * 100);

  const stepStatus: StepStatus = calculateStepStatus(listing);
  const stepDescriptions: StepDescription =
    generateStepDescriptions(listing);
  return (
    <div className="w-1/3 ">
      <div className="shadow-md rounded  m-2 bg-white">
        <div className="p-2">
          <p>
            <span>{formProgress}%</span> completed{" "}
          </p>
          <p>
            {stepStatus["Publish listing"] === "in-progress" && (
              <span className="text-red-500 text-sm">
                {" "}
                Fill out all required fields!
              </span>
            )}
          </p>

          <div className="mt-4">
            <Progress
              value={formProgress}
              className="bg-slate-200 text-brand-light-blue "
            />
          </div>
        </div>
        <Separator className="mt-2" />
        <div>
          <ul>
            {steps.map((step: Step, index) => {
              const stepProgress = stepsProgress[index];

              console.log(
                "stepstatus",
                step.title,
                stepStatus[step.title]
              );
              return (
                <li
                  key={step.title}
                  onClick={() => {
                    setCurrentStep(steps[index].uniquePath);
                  }}
                  className={cn(
                    "flex p-4 pr-1  cursor-pointer hover:bg-gray-50 relative",
                    currentStep === steps[index].uniquePath &&
                      "bg-gray-50 border-l-4 border-l-brand-light-blue"
                  )}
                >
                  <div className=" bg-slate-200 absolute bottom-0.5 left-0.5 rounded-2xl h-1 right-1 w-[98%]">
                    <div
                      className="bg-slate-400 h-1 rounded-2xl"
                      style={{
                        width: `${stepProgress}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center px-2 absolute top-1.5    right-0">
                    {stepStatus[step.title] === "completed" && (
                      <CircleCheck stroke="green" strokeWidth={1.2} />
                    )}

                    {stepStatus[step.title] === "in-progress" && (
                      <CircleCheck
                        stroke="orange"
                        strokeWidth={1.2}
                      />
                    )}

                    {stepStatus[step.title] === "incomplete" && (
                      <CircleAlert stroke="red" strokeWidth={1.2} />
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <p>{step.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {stepDescriptions[step.title]}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
