// import { redirect } from "next/navigation";
import { redirect } from "@/i18n/routing";

import { getCurrentUser } from "@/lib/sessions";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage() {
  const t = await getTranslations();
  const { isAuthenticated, agency } = await getCurrentUser();

  if (isAuthenticated && agency) {
    redirect({
      href: "/agency/profile/info",
      locale: "mk",
    });
  }
  // const { user } = await validateRequest();
  // const user = await getUser();
  return <div>{t("agency.profile.unauthorized")}</div>;
}
