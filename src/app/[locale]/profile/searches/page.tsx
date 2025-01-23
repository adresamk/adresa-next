import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import MySavedSearchesList from "./_components/MySavedSearchesList";
import { getMySavedSearches } from "@/server/actions/savedSearche.actions";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import HireAgencyBanner from "./_components/HireAgencyBanner";

export default async function MySavedSearchesPage() {
  const { isAuthenticated, user } = await getCurrentUser();
  const t = await getTranslations();
  const locale = await getLocale();
  if (isAuthenticated && !user) {
    redirect({ href: "/profile/info", locale: locale });
  }
  const mySavedSearches = await getMySavedSearches();
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg bg-white p-8 shadow">
        <h3 className="mb-3 flex items-center justify-between text-2xl font-semibold">
          {t("user.profile.savedSearches.title")}
          {/* <Button className="uppercase" size={"sm"}>
            <Search className="mr-2" />{" "}
            {t("user.profile.savedSearches.newSearch")}
          </Button> */}
        </h3>
        <Separator className="my-3" />
        <MySavedSearchesList savedSearches={mySavedSearches || []} />
      </div>
      {/* <HireAgencyBanner /> */}
    </div>
  );
}
