import Cookies from "js-cookie";
import { routing } from "@/i18n/routing";

export function getLocaleFromCookies(): string {
  return Cookies.get("NEXT_LOCALE") || routing.defaultLocale;
}
