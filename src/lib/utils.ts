import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberWithDelimiter(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Replace with your desired delimiter
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

export function writeToLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage(key: string) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
