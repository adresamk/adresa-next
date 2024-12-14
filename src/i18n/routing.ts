import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["mk", "en", "al"],
  // Used when no locale matches
  defaultLocale: "mk",
  // Disable locale detection and it will take user device locale instead
  localeDetection: true,
  localePrefix: {
    // as needed allows to use the locale only if it is needed, so for default is missing
    mode: "as-needed",
    // always adds the locale to the pathname
    // mode: "always",
    prefixes: {
      mk: "/mk",
      en: "/en",
      al: "/al",
    },
  },

  // pathnames: {
  //   // example of how to translate a pathname for SEO also
  //   // "/contact": { mk: "/kontakt", en: "/contact", al: "/kontakt" },
  // },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Locale = (typeof routing.locales)[number];
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
