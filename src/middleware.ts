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

  if (!hasLocale) {
    // Redirect to default locale
    const defaultLocale = routing.defaultLocale || "mk";
    const redirectUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Fallback to next-intl middleware for normal processing
  return intlMiddleware(request);
}

export const config = {
  // Match all paths except API routes and static files
  matcher: ["/((?!api|_next|favicon.ico|assets).*)"],
  //matcher: ['/', '/(mk|en|al)/:path*']
};

// export default async function middleware(request: NextRequest) {
//   // Step 1: Use the incoming request (example)
//   const defaultLocale = request.headers.get("x-your-custom-locale") || "en";

//   // Step 2: Create and call the next-intl middleware (example)
//   const handleI18nRouting = createMiddleware({
//     locales: ["en", "mk", "al"],
//     defaultLocale,
//   });
//   const response = handleI18nRouting(request);

//   // Step 3: Alter the response (example)
//   response.headers.set("x-your-custom-locale", defaultLocale);

//   return response;
// }
