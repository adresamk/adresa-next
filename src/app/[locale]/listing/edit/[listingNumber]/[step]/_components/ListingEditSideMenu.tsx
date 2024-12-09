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
} from "@/lib/data/macedoniaOld/importantData";
import { getContactData } from "@/lib/data/listing/helpers";
import { ListingWithUserAndAgency } from "@/lib/types";
import { useTranslations } from "next-intl";
import { ListingWithRelations, UploadedImageData } from "@/types/listing.types";

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
  propertyType: {
    type: 100,
  },
  location: {
    municipality: 20,
    place: 20,
    district: 20,
    address: 20,
    latitude: 10,
    longitude: 10,
  },
  mainCharacteristics: {
    price: 20,
    area: 20,
    // TODO:
    // These are not in the database on listing these are features
    // they need to be retrieved separately
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
  additionalFeatures: {},
  description: {
    description: 32,
    mkdDescription: 33,
    albDescription: 33,
  },
  media: {
    images: 50,
    videoLink: 50,
  },
  contact: {
    name: 20,
    phone: 20,
    email: 20,
    contactHours: 20,
  },
  publish: {
    isPublished: 100,
  },
};
function calculateStepStatus(listing: Listing): StepStatus {
  let statuses: StepStatus = {};
  for (const step of steps) {
    if (step.key === "propertyType") {
      if (listing.type) {
        statuses[step.key] = "completed";
      } else {
        statuses[step.key] = "incomplete";
      }
    }
    if (step.key === "location") {
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
        statuses[step.key] = "incomplete";
      }

      if (
        listing.municipality &&
        listing.place &&
        listing.district &&
        listing.address
      ) {
        statuses[step.key] = "completed";
      } else {
        statuses[step.key] = "in-progress";
      }
    }
    if (step.key === "mainCharacteristics") {
      if (!listing.price && !listing.area) {
        statuses[step.key] = "incomplete";
      }

      if (listing.price && listing.area) {
        statuses[step.key] = "completed";
      } else {
        statuses[step.key] = "in-progress";
      }
    }
    if (step.key === "additionalFeatures") {
      statuses[step.key] = "none";
    }
    if (step.key === "Description") {
      // description: 32,
      // mkdDescription: 33,
      // albDescription: 33,
      if (
        listing.description &&
        listing.mkdDescription &&
        listing.albDescription
      ) {
        statuses[step.key] = "completed";
      } else {
        statuses[step.key] = "none";
      }
    }
    if (step.key === "media") {
      if (
        listing.images &&
        (listing.images as UploadedImageData[]).length > 0 &&
        listing.videoLink
      ) {
        statuses[step.key] = "completed";
      } else {
        statuses[step.key] = "none";
      }
    }
    if (step.key === "contact") {
      // TODO: fix this
      // @ts-ignore
      const contactData = getContactData(listing as ListingWithUserAndAgency);
      if (!contactData.name && !contactData.phone && !contactData.email) {
        statuses[step.key] = "incomplete";
      }
      if (contactData.name && contactData.phone && contactData.email) {
        statuses[step.key] = "completed";
      } else {
        statuses[step.key] = "in-progress";
      }
    }
    if (step.key === "publish") {
      if (
        Object.values(statuses).includes("incomplete") ||
        Object.values(statuses).includes("in-progress")
      ) {
        statuses[step.key] = "in-progress";
      }
    }
  }
  return statuses;
}
type StepDescription = {
  [key: string]: string;
};
function generateStepDescriptions(listing: Listing, t: any): StepDescription {
  const descriptions: StepDescription = {};
  for (const step of steps) {
    if (step.key === "propertyType") {
      let properties = [];
      if (listing.category) {
        properties.push(t(`listing.category.${listing.category}`));
      }
      if (listing.type) {
        properties.push(t(`listing.type.${listing.type}`));
      }
      descriptions[step.key] = properties.length
        ? properties.map(capitalizeString).join(", ")
        : t(`listing.new.progress.steps.${step.key}.description`);
    }
    if (step.key === "location") {
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
      descriptions[step.key] = properties.length
        ? properties.toString()
        : t(`listing.new.progress.steps.${step.key}.description`);
    }
    if (step.key === "mainCharacteristics") {
      let properties = [];

      if (listing.price && listing.area) {
        properties.push(displayPrice(listing.price));
        properties.push(displayArea(listing.area));
      }
      descriptions[step.key] = properties.length
        ? properties.map(capitalizeString).join(", ")
        : t(`listing.new.progress.steps.${step.key}.description`);
    }
    if (step.key === "additionalFeatures") {
      descriptions[step.key] = t(
        `listing.new.progress.steps.${step.key}.description`,
      );
    }
    if (step.key === "description") {
      let properties = [];
      if (listing.description) {
        properties.push(listing.description);
      }
      descriptions[step.key] = properties.length
        ? properties.map(capitalizeString).join(", ")
        : t(`listing.new.progress.steps.${step.key}.description`);
    }
    if (step.key === "media") {
      let properties = [];

      const imagesCount = listing.images
        ? (listing.images as UploadedImageData[]).length
        : 0;
      if (imagesCount > 0) {
        properties.push(
          imagesCount +
            " " +
            (imagesCount > 1
              ? t("listing.new.progress.steps.media.images")
              : t("listing.new.progress.steps.media.image")),
        );
      }
      if (listing.videoLink) {
        properties.push(
          "YouTube " + t("listing.new.progress.steps.media.video"),
        );
      }

      descriptions[step.key] = properties.length
        ? properties.map(capitalizeString).join(", ")
        : t(`listing.new.progress.steps.${step.key}.description`);
    }
    if (step.key === "contact") {
      const contactData = getContactData(listing as ListingWithUserAndAgency);
      if (contactData.email) {
        descriptions[step.key] = contactData.email;
      } else {
        descriptions[step.key] = t(
          `listing.new.progress.steps.${step.key}.description`,
        );
      }
    }
    if (step.key === "publish") {
      descriptions[step.key] = t(
        `listing.new.progress.steps.${step.key}.description`,
      );
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
    let stepProgress = Object.entries(stepsValueSystem[step.key] || {})
      .map(([key, value]) => {
        if (listing.hasOwnProperty(key)) {
          // console.log("L", key, value, listing[key as keyof Listing]);
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
        // In case the field is not in the listing
        return 0;
      })
      .reduce((acc, curr) => acc! + curr!, 0);

    // if (step.key === "contact) {
    //   const contactData = getContactData(listing as ListingWithUserAndAgency);
    //   stepProgress = Object.entries(stepsValueSystem[step.key] || {})
    //     .map(([key, value]) => {
    //       if (contactData.hasOwnProperty(key)) {
    //         if (
    //           contactData[key as keyof typeof contactData] === null ||
    //           contactData[key as keyof typeof contactData] === undefined ||
    //           contactData[key as keyof typeof contactData] === ""
    //         ) {
    //           return 0;
    //         } else {
    //           return value;
    //         }
    //       }
    //     })
    //     .reduce((acc, curr) => acc! + curr!, 0);
    // }
    return stepProgress;
  });

  const stepsProgressSum = stepsProgress.reduce(
    (acc, curr) => acc! + curr!,
    0,
  )!;
  const formProgress = Math.round((stepsProgressSum / 800) * 100);
  const t = useTranslations("");
  const stepStatus: StepStatus = calculateStepStatus(listing);
  const stepDescriptions: StepDescription = generateStepDescriptions(
    listing,
    t,
  );
  // console.log("stePstatus", stepStatus);
  // console.log("stepProgress", stepsProgress);
  // console.log("stepDescriptions", stepDescriptions);
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
                {t("listing.new.steps.fillOut")}
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

              return (
                <li
                  key={step.key}
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
                      {stepStatus[step.key] === "completed" && (
                        <CircleCheck stroke="green" strokeWidth={1.2} />
                      )}

                      {stepStatus[step.key] === "in-progress" && (
                        <CircleCheck stroke="orange" strokeWidth={1.2} />
                      )}

                      {stepStatus[step.key] === "incomplete" && (
                        <CircleAlert stroke="red" strokeWidth={1.2} />
                      )}
                    </div>
                    <p className="">
                      {t(`listing.new.progress.steps.${step.key}.title`)}
                    </p>
                    <p className="line-clamp-2 w-full overflow-x-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500">
                      {stepDescriptions[step.key]}
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
