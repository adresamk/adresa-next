import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { capitalizeString, cn, displayArea, displayPrice } from "@/lib/utils";
import { CircleAlert, CircleCheck } from "lucide-react";
import { Listing } from "@prisma/client";
import { steps, Step, StepStatus } from "../types";
import CircularProgress from "@/components/ui/circular-progress";
import {
  getMunicipalityPlaces,
  municipalitiesOptions,
} from "@/lib/data/macedonia/importantData";
import { getContactData } from "@/lib/data/listing/helpers";
import { ListingWithUserAndAgency } from "@/lib/types";

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
    municipality: 20,
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
      // municipality: 20,
      // place: 20,
      // district: 20,
      // address: 20,
      if (
        !listing.municipality &&
        !listing.place &&
        !listing.district &&
        !listing.address
      ) {
        statuses[step.title] = "incomplete";
      }

      if (
        listing.municipality &&
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
        statuses[step.title] = "incomplete";
      }

      if (listing.price && listing.area) {
        statuses[step.title] = "completed";
      } else {
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
      if (listing.images && listing.images.length > 0 && listing.videoLink) {
        statuses[step.title] = "completed";
      } else {
        statuses[step.title] = "none";
      }
    }
    if (step.title === "Contact Details") {
      // TODO: fix this
      // @ts-ignore
      const contactData = getContactData(listing as ListingWithUserAndAgency);
      if (!contactData.name && !contactData.phone && !contactData.email) {
        statuses[step.title] = "incomplete";
      }
      if (contactData.name && contactData.phone && contactData.email) {
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
      if (listing.municipality && listing.place && listing.district) {
        // properties.push(listing.district);
        const municipalityName = municipalitiesOptions.find(
          (m) => m.id === listing.municipality,
        )?.name;
        const placesForTheMunicipality = getMunicipalityPlaces(
          listing.municipality,
        );
        const placeName = placesForTheMunicipality?.find(
          (p) => p.id === listing.place,
        )?.name;

        properties.push(placeName);
        properties.push(municipalityName);
      }
      descriptions[step.title] = properties.length
        ? properties.toString()
        : step.description;
    }
    if (step.title === "Main characteristics") {
      let properties = [];

      if (listing.price && listing.area) {
        properties.push(displayPrice(listing.price));
        properties.push(displayArea(listing.area));
      }
      descriptions[step.title] = properties.length
        ? properties.map(capitalizeString).join(", ")
        : step.description;
    }
    if (step.title === "Additional features & heating") {
      descriptions[step.title] =
        "Fill in heating details and other information";
    }
    if (step.title === "Description") {
      let properties = [];
      if (listing.description) {
        properties.push(listing.description);
      }
      descriptions[step.title] = properties.length
        ? properties.map(capitalizeString).join(", ")
        : step.description;
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
      const contactData = getContactData(listing as ListingWithUserAndAgency);
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
    let stepProgress = Object.entries(stepsValueSystem[step.title] || {})
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
      const contactData = getContactData(listing as ListingWithUserAndAgency);
      stepProgress = Object.entries(stepsValueSystem[step.title] || {})
        .map(([key, value]) => {
          if (contactData.hasOwnProperty(key)) {
            if (
              contactData[key as keyof typeof contactData] === null ||
              contactData[key as keyof typeof contactData] === undefined ||
              contactData[key as keyof typeof contactData] === ""
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
    0,
  )!;
  const formProgress = Math.round((stepsProgressSum / 800) * 100);

  const stepStatus: StepStatus = calculateStepStatus(listing);
  const stepDescriptions: StepDescription = generateStepDescriptions(listing);
  return (
    <div className="w-[335px]">
      <div className="m-2 rounded bg-white shadow-md">
        <div className="flex items-center gap-1 p-2">
          <div className="h-20 w-20">
            <CircularProgress percentage={formProgress} />
          </div>

          <p>
            {stepStatus["Publish listing"] === "in-progress" && (
              <span className="text-sm text-red-500">
                {" "}
                Fill out all required fields!
              </span>
            )}
          </p>

          <div className="mt-4">
            <Progress
              value={formProgress}
              className="bg-slate-200 text-brand-light-blue"
            />
          </div>
        </div>
        <Separator className="mt-2" />
        <div>
          <ul>
            {steps.map((step: Step, index) => {
              const stepProgress = stepsProgress[index];

              // console.log(
              //   "stepstatus",
              //   step.title,
              //   stepStatus[step.title]
              // );
              return (
                <li
                  key={step.title}
                  onClick={() => {
                    setCurrentStep(steps[index].uniquePath);
                    window.history.pushState(
                      {},
                      "",
                      `${window.location.pathname.split("/").slice(0, -1).join("/")}/${steps[index].uniquePath}`,
                    );
                  }}
                  className={cn(
                    "relative flex cursor-pointer hover:bg-gray-50",
                    currentStep === steps[index].uniquePath &&
                      "border-l-4 border-l-brand-light-blue bg-gray-50",
                  )}
                >
                  <div className="w-full px-4 py-3">
                    <div className="absolute right-0 top-1.5 flex items-center px-2">
                      {stepStatus[step.title] === "completed" && (
                        <CircleCheck stroke="green" strokeWidth={1.2} />
                      )}

                      {stepStatus[step.title] === "in-progress" && (
                        <CircleCheck stroke="orange" strokeWidth={1.2} />
                      )}

                      {stepStatus[step.title] === "incomplete" && (
                        <CircleAlert stroke="red" strokeWidth={1.2} />
                      )}
                    </div>
                    <p className="">{step.title}</p>
                    <p className="line-clamp-2 w-full overflow-x-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500">
                      {stepDescriptions[step.title]}
                    </p>
                    <div className="mt-3 rounded-2xl bg-slate-100">
                      <div
                        className="h-1 rounded-2xl bg-slate-400"
                        style={{
                          width: `${stepProgress}%`,
                        }}
                      ></div>
                    </div>
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
