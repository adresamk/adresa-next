export interface FormData {}

export type StepStatus = {
  [key: string]: "completed" | "incomplete" | "in-progress" | "none";
};
export type Step = {
  key: string;
  description: string;
  fieldsMentioned: string[];
  uniquePath: string;
};

export const initialSteps: Step[] = [
  {
    key: "category",
    description: "Select the category",
    fieldsMentioned: ["category"],
    uniquePath: "category",
  },
];

export const steps: Step[] = [
  {
    key: "propertyType",
    description: "Select the category",
    fieldsMentioned: ["category"],
    uniquePath: "category",
  },
  {
    key: "location",
    description: "Enter your district and place",
    fieldsMentioned: ["location"],
    uniquePath: "location",
  },
  {
    key: "mainCharacteristics",
    description: "Set the price, area size and key features",
    fieldsMentioned: ["bedrooms", "bathrooms", "area", "price"],
    uniquePath: "characteristics",
  },
  {
    key: "additionalFeatures",
    description: "Fill in heating details and other information",
    fieldsMentioned: ["features", "heating"],
    uniquePath: "features",
  },
  {
    key: "description",
    description: "Describe the property in detail",
    fieldsMentioned: ["description"],
    uniquePath: "description",
  },
  {
    key: "media",
    description: "Add photos and video of the property",
    fieldsMentioned: ["photos", "video"],
    uniquePath: "media",
  },
  {
    key: "contact",
    description: "Enter contact details",
    fieldsMentioned: [],
    uniquePath: "contact",
  },
  {
    key: "payment",
    description: "Payment",
    fieldsMentioned: [],
    uniquePath: "payment",
  },
  {
    key: "publish",
    description: "Complete and publish your listing",
    fieldsMentioned: [],
    uniquePath: "publish",
  },
];
