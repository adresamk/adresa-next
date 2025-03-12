import { Separator } from "@/components/ui/separator";
import MyLikedListings from "./_components/MyLikedListings";
import SuggestedAgencies from "@/app/[locale]/_components/SuggestedAgencies";
import { Button } from "@/components/ui/button";
import { HousePlus } from "lucide-react";
import { getLikedListingsByUser } from "@/server/actions/listing.actions";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import HireAgencyBanner from "../searches/_components/HireAgencyBanner";
import FeaturedAgencies from "../../_components/FeaturedAgencies";
import { Metadata } from "next";
import { getFeaturedListings } from "@/server/gets/everything";
import { getCachedFeaturedAgencies } from "@/server/gets/cached";
export const metadata: Metadata = {
  title: "Сочувани огласи",
  description: "Сочувани огласи за корисничкиот профил на Adresa.mk",
};
export default async function ProfileLikedPage() {
  const featuredAgenciesPromise = getCachedFeaturedAgencies();
  const { isAuthenticated, user } = await getCurrentUser();
  const t = await getTranslations();
  const locale = await getLocale();
  if (isAuthenticated && !user) {
    redirect({ href: "/profile/info", locale: locale });
  }
  if (!user) {
    redirect({ href: "/", locale: locale });
    return null;
  }
  const myLikedListings = await getLikedListingsByUser(user.id);
  // console.log("myLikedListings", myLikedListings);
  return (
    <div className="md:min-w-lg m-4 ml-0 flex w-full flex-col gap-3 md:ml-4 md:max-w-2xl">
      <div className="w-full rounded-lg bg-white pl-2 shadow md:pl-4">
        <h3 className="mb-3 mt-3 px-2 text-2xl font-semibold sm:mt-4">
          {t("user.profile.likedListings.title")}
          <span className="ml-3 text-base text-gray-500">
            ({myLikedListings.length})
          </span>
        </h3>
        <Separator className="my-3" />
        {myLikedListings && <MyLikedListings listings={myLikedListings} />}
        {!myLikedListings && (
          <div className="flex h-full min-h-[200px] w-full items-center justify-center">
            <p>{t("user.profile.likedListings.noLikedListings")}</p>
          </div>
        )}
      </div>
      {/* <HireAgencyBanner /> */}
      <div className="verflow-x-auto rounded-lg bg-white shadow">
        <FeaturedAgencies featuredAgenciesPromise={featuredAgenciesPromise} />
      </div>
    </div>
  );
}
