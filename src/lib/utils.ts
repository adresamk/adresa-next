import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function generateUniqueToken() {
  return Math.random().toString(36).slice(2, 11); // Simple token generation
}

export function validPhoneNumber(phone: string) {
  return true;
}
type AllowedCurrencies = "USD" | "EUR";
export function displayPrice(
  value: number | null,
  currency: AllowedCurrencies = "EUR",
) {
  if (value === null) {
    return "Number was null, check data";
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
  let output = displayPrice(value, currency);

  return output + "/" + periodLabel;
}

export function displayArea(value: number | null) {
  if (value === null) {
    return "Number was null, check data";
  }
  return `${value} m²`;
}

export function displayPricePerSquare(
  price: number | null,
  area: number | null,
  currency: AllowedCurrencies = "EUR",
) {
  if (!price || !area || area <= 0) return null; // Handle invalid inputs gracefully

  const pricePerSquare = price / area;
  return displayPrice(pricePerSquare, currency) + "/m²"; // Use the displayPrice function
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

function checkCookie(cookieName: string) {
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
export enum LocalStorageKeysOptions {
  mkRecentSearches = "mkRecentSearches",
  enRecentSearches = "enRecentSearches",
  alRecentSearches = "alRecentSearches",
  mkRecentlyViewedListings = "mkRecentlyViewedListings",
  enRecentlyViewedListings = "enRecentlyViewedListings",
  alRecentlyViewedListings = "alRecentlyViewedListings",
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
