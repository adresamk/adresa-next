import { cookies } from "next/headers"; // Next.js 13+ App Router
import { redirect as nextRedirect, RedirectType } from "next/navigation";
import { revalidatePath as nextRevalidatePath } from "next/cache";
import { Locale, routing } from "@/i18n/routing";
async function getLocaleFromCookies(): Promise<string> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value as Locale;

  return routing.locales.includes(locale ?? "")
    ? locale!
    : routing.defaultLocale;
}

export function withLocale(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error("Path must start with '/'");
  }

  const locale = getLocaleFromCookies(); // Automatically detect locale
  return `/${locale}${path}`;
}

export function redirect(path: string, type?: RedirectType) {
  const localizedPath = withLocale(path);
  return nextRedirect(localizedPath, type);
}

export function revalidatePath(path: string, type?: "page" | "layout") {
  const localizedPath = withLocale(path);
  return nextRevalidatePath(localizedPath, type);
}
