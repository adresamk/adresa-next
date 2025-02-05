import { redirect } from "@/i18n/routing";

import { getCurrentUser } from "@/lib/sessions";
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мој Профил",
  description: "Мој Профил на Adresa.mk",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const t = await getTranslations();
  const { isAuthenticated, agency } = await getCurrentUser();
  const locale = await getLocale();
  if (isAuthenticated && agency) {
    redirect({
      href: "/agency/profile/info",
      locale: locale,
    });
  }
  return <div>{t("agency.profile.unauthorized")}</div>;
}
