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
import { Metadata } from "next";
import UserComponents from "./_components/UserComponents";
import { ListingsLoadingSkeleton } from "./_components/skeletons/ListingsLoadingSkeleton";
import { Suspense } from "react";
import { AgenciesLoadingSkeleton } from "./_components/skeletons/AgenciesLoadingSkeleton";

export const metadata: Metadata = {
  title: "Недвижини во Македонија",
  description: "Огласи за недвижини во Македонија",
  keywords: [
    "realestate",
    "real estate",
    "недвижини",
    "огласи",
    "агенции",
    "продажба",
    "изнајмување",
    "станови",
    "куќи",
    "земјишта",
  ],
  authors: [{ name: "Mario K", url: "https://mariok.mk" }],
  creator: "Mario K",
  publisher: "Adresa",
  twitter: {
    card: "summary_large_image",
    title: "Adresa.mk - Homepage",
    description: "Вебсајт за огласи за недвижини",
    images: ["/twitter-image.png"],
  },
  openGraph: {
    title: "Adresa.mk - Homepage",
    description: "Вебсајт за огласи за недвижини",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const revalidate = 3600;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Prefetch user data in parallel with page render
  // const userDataPromise = getCurrentUser();
  // // Only check and redirect if needed after initial content is shown
  // userDataPromise.then(({ user, agency, isAuthenticated, account }) => {
  //   if (!agency && !user && isAuthenticated) {
  //     if (account?.role === AccountType.USER) {
  //       redirect({
  //         href: "/profile/info",
  //         locale: locale,
  //       });
  //     } else if (account?.role === AccountType.AGENCY) {
  //       redirect({
  //         href: "/agency/profile/details",
  //         locale: locale,
  //       });
  //     }
  //   }
  // });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <SearchHero />
      {/* Personalized content */}
      <section className="mb-3 mt-6 w-full max-w-7xl rounded-lg border border-slate-300 bg-slate-100">
        <Suspense>
          <UserComponents />
        </Suspense>
        <Suspense fallback={<ListingsLoadingSkeleton />}>
          <LatestListings />
        </Suspense>
        {/* <SuggestedProperties /> */}
        <Suspense fallback={<ListingsLoadingSkeleton />}>
          <FeaturedListings />
        </Suspense>
        {/* <Banner /> */}
        {/* <SuggestedAgencies /> */}
        <Suspense fallback={<AgenciesLoadingSkeleton />}>
          <FeaturedAgencies />
        </Suspense>
      </section>
    </main>
  );
}
