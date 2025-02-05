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
    "недвижини",
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
    <main className="mx-auto flex max-w-7xl px-6">
      <div className="min-h-screen w-[220px] bg-white shadow">
        <div className="px-3 py-6">
          <p>{t("user.profile.menu.welcome")}</p>
          {isAuthenticated && !user && (
            <p className="mt-2 text-xl text-red-400">
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

      <div className="flex-1 p-4">{children}</div>
    </main>
  );
}
