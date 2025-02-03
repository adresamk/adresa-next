import Banner from "@/components/shared/Banner";
import SearchHero from "./_components/SearchHero";
import UserGreeting from "./_components/UserGreeting";
import LastSearches from "./_components/LastSearches";
import RecentlyViewedListings from "./_components/RecentlyViewedListings";
import FeaturedListings from "./_components/FeaturedListings";
import FeaturedAgencies from "./_components/FeaturedAgencies";
import { getCurrentUser } from "@/lib/sessions";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import { AccountType } from "@prisma/client";
import LatestListings from "./_components/LatestListings";

export default async function Home() {
  // works on the server side
  // const user = await getUser();
  const { user, agency, isAuthenticated, account } = await getCurrentUser();
  const locale = await getLocale();
  if (!agency && !user && isAuthenticated) {
    if (account?.role === AccountType.USER) {
      redirect({
        href: "/profile/info",
        locale: locale,
      });
    }
  }

  if (!agency && !user && isAuthenticated) {
    if (account?.role === AccountType.AGENCY) {
      redirect({
        href: "/agency/profile/details",
        locale: locale,
      });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <SearchHero />
      {/* Personalized content */}
      <section className="mb-3 mt-6 w-full max-w-7xl rounded-lg border border-slate-300 bg-slate-100">
        {user && (
          <>
            <UserGreeting user={user} />
            {/* Comes from LS, but needs to go to API for the newest listings count */}
            {/* en_recentSearches */}
            {/* en_latestSearchedGeographies */}
            <LastSearches />
            {/* Comes from LS or COOKIES, keep last search there */},
            {/* en_recentlyViewedProperties */}
            {/* Latest Searches ? */}
            <RecentlyViewedListings />
          </>
        )}
        <LatestListings />
        {/* <SuggestedProperties /> */}
        <FeaturedListings />
        {/* <Banner /> */}
        {/* <SuggestedAgencies /> */}
        <FeaturedAgencies />
      </section>
    </main>
  );
}
