import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

// Initialize the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    const response = await handleI18nMiddleware(request);
    const token = request.cookies.get("auth_session")?.value ?? null;
    if (token !== null) {
      response.cookies.set("auth_session", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }
    return response;
  }

  // CSRF protection for non-GET requests
  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");
  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, { status: 403 });
  }

  try {
    const origin = new URL(originHeader);
    if (origin.host !== hostHeader) {
      return new NextResponse(null, { status: 403 });
    }
  } catch {
    return new NextResponse(null, { status: 403 });
  }

  // Handle i18n for non-GET requests
  return await handleI18nMiddleware(request);
}

// Separated i18n logic into a helper function
async function handleI18nMiddleware(
  request: NextRequest,
): Promise<NextResponse> {
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
