import MyListingsList from "@/components/shared/profile/MyListingsList";
import { Separator } from "@/components/ui/separator";
import { redirect } from "@/i18n/routing";

import prismadb from "@/lib/db";
import { getCurrentUser } from "@/lib/sessions";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
export const metadata: Metadata = {
  title: "Мои огласи",
  description: "Мои огласи за корисничкиот профил на Adresa.mk",
};
export default async function ProfileListingsPage() {
  const { isAuthenticated, user } = await getCurrentUser();
  const t = await getTranslations();
  const locale = await getLocale();
  if (isAuthenticated && !user) {
    redirect({ href: "/profile/info", locale: locale });
  }

  const myListings = await prismadb.listing.findMany({
    where: {
      userId: user!.id,
    },
    include: {
      viewCount: true,
    },
  });
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-white p-8 shadow">
      <h3 className="mb-3 text-2xl font-semibold">
        {t("user.profile.listings.title")}
      </h3>
      <Separator className="my-3" />

      <MyListingsList listings={myListings} />
    </div>
  );
}
