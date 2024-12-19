import { redirect } from "next/navigation";
import ProfileSideMenu from "./ProfileSideMenu";
import { getCurrentUser } from "@/lib/sessions";
import { getTranslations } from "next-intl/server";

type Params = Promise<{ children: React.ReactNode }>;

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

  if (!isAuthenticated) {
    redirect("/");
  }

  if (!user) {
    if (agency) {
      redirect("/agency/profile/info");
    }
  }

  return (
    <main className="mx-auto flex max-w-7xl px-6">
      <div className="min-h-screen min-w-[220px] bg-white shadow">
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
      <div className="">{children}</div>
    </main>
  );
}
