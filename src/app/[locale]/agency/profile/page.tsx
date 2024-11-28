import { getUser, validateRequest } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage() {
  const t = await getTranslations();
  // const { user } = await validateRequest();
  // const user = await getUser();
  return <div>{t("agency.profile.unauthorized")}</div>;
}
