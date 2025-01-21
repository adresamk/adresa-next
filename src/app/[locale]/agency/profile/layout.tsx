import AgencyProfileSideMenu from "./AgencyProfileSideMenu";
import { getLocale, getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "@/i18n/routing";
type Params = Promise<{ children: React.ReactNode }>;

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const t = await getTranslations();
  const layoutParams = await params;
  const { isAuthenticated, agency } = await getCurrentUser();
  const locale = await getLocale();
  // redirect is ok becase we are moving it away from the layout
  if (!isAuthenticated) {
    redirect({ href: "/", locale: locale });
  }

  return (
    <main className="mx-auto flex max-w-[1200px] px-6 pb-12 group-[.mobile]:flex-col">
      <div className="min-h-screen min-w-[220px] bg-white shadow group-[.mobile]:min-h-fit">
        <div className="px-3 py-6">
          <p>{t("agency.profile.welcome")}</p>
          {isAuthenticated && !agency && (
            <p className="mt-2 text-xl text-red-400">
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
