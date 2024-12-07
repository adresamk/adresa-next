import MyListingsList from "@/components/shared/profile/MyListingsList";
import { Separator } from "@/components/ui/separator";
import { redirect } from "@/i18n/routing";

import { getUser } from "@/lib/auth";
import prismadb from "@/lib/db";
import { getCurrentUser } from "@/lib/sessions";
import { getTranslations } from "next-intl/server";

export default async function ProfileListingsPage() {
  const { isAuthorized, agency } = await getCurrentUser();
  const t = await getTranslations();
  if (isAuthorized && !agency) {
    redirect({ href: "/agency/profile/details", locale: "mk" });
  }

  if (!agency) {
    return <div>Agency Missing </div>;
  }
  const myListings = await prismadb.listing.findMany({
    where: {
      agencyId: agency.id,
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
