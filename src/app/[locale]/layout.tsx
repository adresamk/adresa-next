import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import "@/styles/global.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextIntlClientProvider } from "next-intl";
import { cn } from "@/lib/utils";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ourFileRouter } from "../api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";
import { Locale, routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { headers } from "next/headers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  userScalable: false,
};
export const metadata: Metadata = {
  title: {
    default: "Adresa.mk",
    template: "%s | Adresa.mk",
  },

  description: "Вебсајт за огласи за недвижини",
  icons: {
    icon: "/assets/adresa-favicon.png",
  },
};

type Params = Promise<{
  // children: React.ReactNode;
  // modal: React.ReactNode;
  locale: string;
}>;

export default async function RootLayout({
  children,
  modal,
  params,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Params;
}) {
  const layoutParams = await params;
  const { locale } = layoutParams;

  // Get device type from user agent on server side
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
  const isTablet = /tablet|ipad/i.test(userAgent);
  const deviceType = isMobile ? "mobile" : "desktop";

  if (!routing.locales.includes(locale as Locale)) {
    console.log("locale not found", locale);
    notFound();
  }
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`group ${deviceType}`}>
      <body
        className={cn(
          "min-h-screen bg-background pt-[60px] font-sans antialiased md:pt-[80px]",
          fontSans.variable,
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <NuqsAdapter>
            <Header />
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            {modal}
            {children}
            <Footer />
            <Toaster />
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
