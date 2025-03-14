import { Separator } from "@/components/ui/separator";
import MySavedSearchesList from "./_components/MySavedSearchesList";
import { getMySavedSearches } from "@/server/actions/savedSearche.actions";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import HireAgencyBanner from "./_components/HireAgencyBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Зачувани пребарувања",
  description: "Зачувани пребарувања за корисничкиот профил на Adresa.mk",
};
export default async function MySavedSearchesPage() {
  const { isAuthenticated, user } = await getCurrentUser();
  const t = await getTranslations();
  const locale = await getLocale();
  if (isAuthenticated && !user) {
    redirect({ href: "/profile/info", locale: locale });
  }
  const mySavedSearches = await getMySavedSearches();
  return (
    <div className="mx:m-4 mt-4 flex w-full flex-col gap-3 rounded-lg bg-white p-4 shadow md:m-8 md:max-w-3xl md:p-8">
      <h3 className="mb-3 flex items-center justify-between text-2xl font-semibold">
        {t("user.profile.savedSearches.title")}
        {/* <Button className="uppercase" size={"sm"}>
            <Search className="mr-2" />{" "}
            {t("user.profile.savedSearches.newSearch")}
          </Button> */}
      </h3>
      <Separator className="" />
      <MySavedSearchesList savedSearches={mySavedSearches || []} />
      {/* <HireAgencyBanner /> */}
    </div>
  );
}
