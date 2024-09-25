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

export function isLoggedInClient() {
  if (typeof window === "undefined") {
    return;
  }
  const authCookieExists = checkCookie("auth-cookie-exists");
  console.log(authCookieExists);
  return authCookieExists;
}

function checkCookie(cookieName: string) {
  const cookies = document.cookie.split(";"); // Split the cookie string by semicolons to get individual cookies
  console.log(cookies);

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
