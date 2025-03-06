import AgencyProfileSideMenu from "./AgencyProfileSideMenu";
import { getLocale, getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "@/i18n/routing";
import { Metadata } from "next";
type Params = Promise<{ children: React.ReactNode }>;

export const metadata: Metadata = {
  title: {
    default: "Мој Профил",
    template: "%s | Агенција | Adresa.mk",
  },
  description: "Информации за агенција на Adresa.mk",
  keywords: [
    "realestate",
    "real estate",
    "агенција",
    "огласи",
    "продажба",
    "изнајмување",
    "станови",
    "куќи",
    "земјишта",
  ],
  authors: [{ name: "Mario K", url: "https://mariok.mk" }],
  creator: "Mario K",
  publisher: "Adresa",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": 0,
      "max-image-preview": "none",
      "max-snippet": 0,
    },
  },
};
export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const t = await getTranslations();
  const { isAuthenticated, agency } = await getCurrentUser();
  const locale = await getLocale();
  // redirect is ok becase we are moving it away from the layout
  if (!isAuthenticated) {
    redirect({ href: "/", locale: locale });
  }

  return (
    <main className="relativemx-auto flex max-w-[1200px] flex-col px-3 pb-12 group-[.mobile]:flex-col sm:flex-row sm:px-6">
      <div className="sticky -top-10 z-10 mt-3 min-w-[220px] rounded-md bg-white shadow-md group-[.mobile]:min-h-fit sm:mt-0 sm:min-h-screen">
        <div className="flex flex-row-reverse items-start justify-end gap-3 px-2 py-3 sm:flex-col sm:gap-1 sm:px-3 sm:py-6">
          <p className="text-lg font-light text-brand-black-muted text-slate-500 sm:text-base">
            {t("agency.profile.welcome")}
          </p>
          {isAuthenticated && !agency && (
            <p className="mt-2 text-xl font-semibold text-red-400">
              {t("agency.profile.finishSetup")}
            </p>
          )}
          {isAuthenticated && agency && (
            <p className="text-xl">
              {agency?.ownerFirstName} {agency?.ownerLastName}
            </p>
          )}
        </div>
        <AgencyProfileSideMenu agency={agency} />
      </div>
      <div className="w-full">{children}</div>
    </main>
  );
}
