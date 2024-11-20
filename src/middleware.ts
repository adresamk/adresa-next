import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

// Initialize the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip processing for already localized paths
  const locales = routing.locales || ["en", "mk", "al"]; // Supported locales
  const hasLocale = locales.some((locale) => pathname.startsWith(`/${locale}`));
  const localePrefix = routing.localePrefix;
  // @ts-ignore
  // console.log(localePrefix, typeof localePrefix, localePrefix.mode);
  if (!hasLocale) {
    // @ts-ignore
    if (localePrefix.mode === "alaways") {
      return intlMiddleware(request);
      // Redirect to default locale
      const defaultLocale = routing.defaultLocale || "mk";
      const redirectUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Fallback to next-intl middleware for normal processing
  return intlMiddleware(request);
}

export const config = {
  // Match all paths except API routes and static files
  matcher: ["/((?!api|_next|favicon.ico|assets).*)"],
  //matcher: ['/', '/(mk|en|al)/:path*']
};
