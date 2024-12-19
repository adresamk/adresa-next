import { Separator } from "@/components/ui/separator";
import MyLikedListings from "./_components/MyLikedListings";
import SuggestedAgencies from "@/app/[locale]/_components/SuggestedAgencies";
import { Button } from "@/components/ui/button";
import { HousePlus } from "lucide-react";
import { getLikedListingsByUser } from "@/server/actions/listing.actions";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import HireAgencyBanner from "../searches/_components/HireAgencyBanner";

export default async function ProfileLikedPage() {
  const { isAuthenticated, user } = await getCurrentUser();
  const t = await getTranslations();
  if (isAuthenticated && !user) {
    redirect({ href: "/profile/info", locale: "mk" });
  }
  const myLikedListings = await getLikedListingsByUser();
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg bg-white p-8 shadow">
        <h3 className="mb-3 text-2xl font-semibold">
          {t("user.profile.likedListings.title")}
        </h3>
        <Separator className="my-3" />
        {myLikedListings && <MyLikedListings listings={myLikedListings} />}
        {!myLikedListings && (
          <div className="flex h-full items-center justify-center">
            <p>{t("user.profile.likedListings.noLikedListings")}</p>
          </div>
        )}
      </div>
      <HireAgencyBanner />
      <div className="verflow-x-auto rounded-lg bg-white shadow">
        <SuggestedAgencies />
      </div>
    </div>
  );
}
