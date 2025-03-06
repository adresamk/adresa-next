import { redirect } from "@/i18n/routing";
import ProfileSideMenu from "./ProfileSideMenu";
import { getCurrentUser } from "@/lib/sessions";
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";

type Params = Promise<{ children: React.ReactNode }>;

export const metadata: Metadata = {
  title: {
    default: "Мој Профил",
    template: "%s | Профил | Adresa.mk",
  },
  description: "Мој Профил",
  keywords: [
    "realestate",
    "real estate",
    "недвижнини",
    "огласи",
    "агенции",
    "продажба",
    "изнајмување",
    "станови",
    "куќи",
    "земјишта",
  ],
  authors: [{ name: "Mario K", url: "https://mariok.mk" }],
  creator: "Mario K",
  publisher: "Adresa",
  openGraph: {
    title: "Мој Профил | Adresa.mk",
    description: "Мој профил на Adresa.mk",
    // images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: false,
    googleBot: {
      index: true,
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
  const layoutParams = await params;
  const { isAuthenticated, user, agency, account } = await getCurrentUser();
  const t = await getTranslations();
  const locale = await getLocale();
  if (!isAuthenticated) {
    redirect({
      href: "/",
      locale: locale,
    });
  }

  if (!user) {
    if (agency) {
      redirect({
        href: "/agency/profile/info",
        locale: locale,
      });
    }
  }

  return (
    <main className="relative mx-auto flex max-w-[1200px] flex-col px-3 pb-12 group-[.mobile]:flex-col sm:flex-row sm:px-6">
      <div className="sticky -top-10 z-10 mt-3 min-w-[220px] rounded-md bg-white shadow-md group-[.mobile]:min-h-fit sm:mt-0 sm:min-h-screen">
        <div className="flex flex-row-reverse items-start justify-end gap-3 px-2 py-3 sm:flex-col sm:gap-1 sm:px-3 sm:py-6">
          <p className="text-lg font-light text-brand-black-muted text-slate-500 sm:text-base">
            {t("user.profile.menu.welcome")}
          </p>
          {isAuthenticated && !user && (
            <p className="mt-2 text-xl font-semibold text-red-400">
              {t("user.profile.finishSetup")}
            </p>
          )}
          {isAuthenticated && user && (
            <p className="text-xl">
              {user.firstName} {user.lastName}
            </p>
          )}
        </div>
        <ProfileSideMenu user={user} />
      </div>

      <div className="w-full">{children}</div>
    </main>
  );
}
