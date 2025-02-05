import MyListingsList from "@/components/shared/profile/MyListingsList";
import { Separator } from "@/components/ui/separator";
import { redirect } from "@/i18n/routing";

import { getUser } from "@/lib/auth";
import prismadb from "@/lib/db";
import { getCurrentUser } from "@/lib/sessions";
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Наши огласи",
  description: "Наши огласи кои ги имаме објавено на Adresa.mk",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfileListingsPage() {
  const { isAuthenticated, agency } = await getCurrentUser();
  const t = await getTranslations();
  const locale = await getLocale();
  if (isAuthenticated && !agency) {
    redirect({ href: "/agency/profile/details", locale: locale });
  }

  if (!agency) {
    return <div>Agency Missing </div>;
  }
  const myListings = await prismadb.listing.findMany({
    where: {
      agencyId: agency.id,
    },
    include: {
      viewCount: true,
    },
  });

  // const myListings = await prismadb.listing.findMany({
  //   where: {
  //     userId: user.id,
  //   },
  // });
  return (
    <div className="ml-4 mt-4 rounded-lg bg-white p-8 shadow">
      <h3 className="mb-3 text-2xl font-semibold">
        {t("agency.profile.listingsPage.title")}
      </h3>
      <Separator className="my-3" />

      <MyListingsList listings={myListings} agency={agency} />
    </div>
  );
}
