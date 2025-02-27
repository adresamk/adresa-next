import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LocalStorageKeysOptions } from "./types";
import { Listing } from "@prisma/client";
import { ListingWithRelations, UploadedImageData } from "@/types/listing.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function generateUniqueToken() {
  return Math.random().toString(36).slice(2, 11); // Simple token generation
}
export function generateCompanySlug(companyName: string) {
  return companyName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
export function normalizeUrl(url: string) {
  // Check if the URL already has a scheme
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}
export function validPhoneNumber(phone: string) {
  return true;
}
type AllowedCurrencies = "USD" | "EUR";
export function formatPrice(value: number | null) {
  const price = displayPrice(value, "EUR");
  // console.log(price);
  // this is not space but a non-breaking space,copie pasted from console log
  return price?.toString().replace(" €", "");
}
export function displayPrice(
  value: number | null,
  currency?: AllowedCurrencies | undefined,
  t?: Function,
) {
  if (currency === undefined) {
    currency = "EUR";
  }
  if (value === null) {
    return t ? t("common.words.missingValue") : "N/A";
  }
  if (value < 20) {
    if (t) {
      return t("common.words.notFixed");
    }
  }
  if (currency !== "USD" && currency !== "EUR") {
    throw new Error("Invalid currency. Only USD and EUR are allowed.");
  }
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0, // Show no decimals if not needed
    maximumFractionDigits: 0, // Show 2 decimals if needed
  }).format(value);
}
export function displayPriceMonthly(
  value: number | null,
  currency: AllowedCurrencies = "USD",
  periodLabel = "",
) {
  if (value === null) {
    return null;
  }
  let output = displayPrice(value, currency);

  return output + "/" + periodLabel;
}

export function displayArea(value: number | null) {
  if (value === null) {
    return null;
  }
  return `${value} m²`;
}

export function displayPricePerSquare(
  price: number | null,
  area: number | null,
  currency: AllowedCurrencies = "EUR",
  t?: Function,
) {
  if (!price || !area || area <= 0) return null; // Handle invalid inputs gracefully

  const pricePerSquare = price / area;
  return displayPrice(pricePerSquare, currency, t) + "/m²"; // Use the displayPrice function
}

function parseDateString(dateString: string, delimiter: string): Date | null {
  const parts = dateString.split(delimiter);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
    const year = parseInt(parts[2], 10);
    const parsedDate = new Date(year, month, day);
    return isNaN(parsedDate.getTime()) ? null : parsedDate; // Return null if invalid date
  }
  return null; // Return null if format is incorrect
}

export function displayDate(date: Date | string | null, delimiter = "/") {
  let parsedDate: Date | null = null;
  if (typeof date === "string") {
    parsedDate = parseDateString(date, delimiter) || new Date(date); // Try parsing, fallback to Date constructor

    if (isNaN(parsedDate?.getTime() || NaN)) {
      // console.error("Invalid date string provided");
      return "N/A";
    }
  } else if (date instanceof Date) {
    parsedDate = date;
  }

  if (!parsedDate || isNaN(parsedDate.getTime())) {
    // console.error("Invalid date provided");
    return null;
  }

  const day = String(parsedDate.getDate()).padStart(2, "0"); // Ensure 2-digit day
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = parsedDate.getFullYear();

  return `${day}${delimiter}${month}${delimiter}${year}`;
}

export function capitalizeString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function getLoggedInUserId() {
  if (typeof window === "undefined") {
    return;
  }
  const userId = document.cookie.split("auth-cookie-exists=")[1];
  return userId;
}
export function isLoggedInClient() {
  if (typeof window === "undefined") {
    return;
  }
  const authCookieExists = checkCookie("auth-cookie-exists");
  // console.log(authCookieExists);
  return authCookieExists;
}

export function checkCookie(cookieName: string) {
  const cookies = document.cookie.split(";"); // Split the cookie string by semicolons to get individual cookies
  // console.log(cookies);

  for (let cookie of cookies) {
    // Trim leading/trailing spaces
    cookie = cookie.trim();

    // Check if the current cookie starts with the given name
    if (cookie.startsWith(`${cookieName}=`)) {
      return true; // Cookie exists
    }
  }
  return false; // Cookie does not exist
}
export function deleteCookie(cookieName: string) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function parseQueryString(queryString: string) {
  const params = new URLSearchParams(queryString);
  console.log(params);
  const obj: { [key: string]: string } = {};
  params.forEach((value, key) => {
    obj[key] = value;
  });
  return params;
}

export function createSlug(text: string) {
  return text.replace(/\s+/g, "-").toLowerCase();
}

export function writeToLocalStorage(key: LocalStorageKeysOptions, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readFromLocalStorage(key: LocalStorageKeysOptions) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export function getFromLocalStorage(key: string) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export function checkListingCompleteness(listing: Listing) {
  const lwr = listing as ListingWithRelations;
  if (
    !lwr.type ||
    !lwr.category ||
    !lwr.transactionType ||
    !lwr.price ||
    !lwr.area ||
    (lwr.commercial && !lwr.commercial.floor) ||
    (lwr.images && (lwr.images as UploadedImageData[]).length === 0) ||
    (lwr.user && !lwr.user.contactName) ||
    (lwr.user && !lwr.user.contactPhone) ||
    (lwr.user && !lwr.user.contactEmail)
  ) {
    return false;
  }
  return true;
}
