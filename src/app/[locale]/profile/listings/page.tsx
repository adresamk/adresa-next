import MyListingsList from "@/components/shared/profile/MyListingsList";
import { Separator } from "@/components/ui/separator";
import { redirect } from "@/i18n/routing";

import { getUser } from "@/lib/auth";
import prismadb from "@/lib/db";
import { getCurrentUser } from "@/lib/sessions";
import { getTranslations } from "next-intl/server";

export default async function ProfileListingsPage() {
  const { isAuthenticated, user } = await getCurrentUser();
  const t = await getTranslations();

  if (isAuthenticated && !user) {
    redirect({ href: "/profile/info", locale: "mk" });
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
