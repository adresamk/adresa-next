"use client";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { capitalizeString, cn, displayArea, displayPrice } from "@/lib/utils";
import { CircleAlert, CircleCheck } from "lucide-react";
import {
  Listing,
  PropertyCategory,
  PropertyTransactionType,
  PropertyType,
} from "@prisma/client";
import {
  Step,
  StepStatus,
} from "@/app/[locale]/listing/edit/[listingNumber]/[step]/types";
import CircularProgress from "@/components/ui/circular-progress";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import TransactionType from "@/components/shared/filters/primary/TransactionTypeFilter";
import { useRouter } from "@/i18n/routing";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface NewListing {
  category: PropertyCategory | "";
  type: PropertyType | "";
  transactionType: PropertyTransactionType | "";
}

interface ListingNewSideMenuProps {
  steps: Step[];
}
interface stepsValueSystemType {
  [key: string]: {
    [fieldName: string]: number;
  };
}
const stepsValueSystem: stepsValueSystemType = {
  category: {
    type: 34,
    category: 33,
    transactionType: 33,
  },
};
function calculateStepStatus(listing: NewListing, steps: Step[]): StepStatus {
  let statuses: StepStatus = {};
  for (const step of steps) {
    if (step.key === "category") {
      if (listing.type && listing.category && listing.transactionType) {
        statuses[step.key] = "completed";
      } else {
        statuses[step.key] = "incomplete";
      }
    }
  }
  return statuses;
}
type StepDescription = {
  [key: string]: string;
};
function generateStepDescriptions(
  listing: NewListing,
  t: any,
  locale: string,
  steps: Step[],
): StepDescription {
  const descriptions: StepDescription = {};
  for (const step of steps) {
    if (step.key === "category") {
      let properties = [];
      if (listing.category) {
        properties.push(t(`common.property.category.${listing.category}`));
      }
      if (listing.type) {
        properties.push(t(`common.property.type.${listing.type}`));
      }
      descriptions[step.key] = properties.length
        ? properties.map(capitalizeString).join(", ")
        : t(`listing.new.progress.steps.${step.key}.description`);
    }
  }
  return descriptions;
}

export default function ListingNewSideMenu({ steps }: ListingNewSideMenuProps) {
  const [listing, setListing] = useState<NewListing>({
    category: "",
    type: "",
    transactionType: "",
  });

  //effect description
  useEffect(() => {
    // @ts-ignore
    window.setInitialListing = (prop, value) =>
      setListing((pv) => ({ ...pv, [prop]: value }));
  }, []);

  const stepsProgress = steps.map((step) => {
    let stepProgress = Object.entries(stepsValueSystem[step.key] || {})
      .map(([key, value]) => {
        if (listing.hasOwnProperty(key)) {
          // console.log("L", key, value, listing[key as keyof Listing]);
          if (
            !listing[key as keyof NewListing] ||
            (Array.isArray(listing[key as keyof NewListing]) &&
              listing[key as keyof NewListing].length === 0)
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

    return stepProgress;
  });

  const stepsProgressSum = stepsProgress.reduce(
    (acc, curr) => acc! + curr!,
    0,
  )!;
  const formProgress = Math.round((stepsProgressSum / 800) * 100);
  const t = useTranslations("");
  const locale = useLocale();
  const stepStatus: StepStatus = calculateStepStatus(listing, steps);
  const stepDescriptions: StepDescription = generateStepDescriptions(
    listing,
    t,
    locale,
    steps,
  );
  // console.log("stePstatus", stepStatus);
  // console.log("stepProgress", stepsProgress);
  // console.log("stepDescriptions", stepDescriptions);
  return (
    <div className="sticky top-[50px] z-10 w-full sm:w-[335px]">
      <div className="m-2 rounded bg-white shadow-md">
        {/* Progress bar */}
        <div className="flex items-center gap-1 p-1 px-1.5 sm:p-2">
          <div className="h-12 w-12 sm:h-20 sm:w-20">
            <CircularProgress percentage={formProgress} />
          </div>
          <div className="flex w-full flex-row items-start gap-0.5 sm:flex-col">
            <p className="text-sm">
              {formProgress}% {t(`common.words.filledOut`)}
            </p>
            <p>
              {stepStatus["publish"] === "in-progress" && (
                <span className="text-sm text-red-500">
                  {t("listing.new.steps.fillOut")}
                </span>
              )}
            </p>
          </div>

          <div className="mt-4">
            <Progress
              value={formProgress}
              className="bg-slate-200 text-brand-light-blue"
            />
          </div>
        </div>
        <Separator className="sm:mt-2" />
        <div>
          <ul>
            {steps.map((step: Step, index) => {
              const stepProgress = stepsProgress[index];

              return (
                <li
                  key={step.key}
                  className={cn(
                    "relative flex w-full cursor-pointer hover:bg-gray-50 sm:border-l-4 sm:border-l-brand-light-blue sm:bg-gray-50",
                  )}
                >
                  <div className="w-full px-1.5 py-2.5 sm:px-4 sm:py-3">
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
                    <p className="mb-1.5 text-sm leading-3 sm:mb-1 sm:text-base sm:leading-4">
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
