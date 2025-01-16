import { redirect } from "@/i18n/routing";

import { getCurrentUser } from "@/lib/sessions";
import { getLocale, getTranslations } from "next-intl/server";

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
