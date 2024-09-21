import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumberWithDelimiter = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Replace with your desired delimiter
};
