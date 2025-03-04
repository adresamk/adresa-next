import SearchHero from "./_components/SearchHero";

import FeaturedListings from "./_components/FeaturedListings";
import FeaturedAgencies from "./_components/FeaturedAgencies";

// export const dynamic = "force-static";
import LatestListings from "./_components/LatestListings";
import { Metadata } from "next";
// import UserComponents from "./_components/UserComponents";

import { ListingsLoadingSkeleton } from "./_components/skeletons/ListingsLoadingSkeleton";
import { Suspense } from "react";
import { AgenciesLoadingSkeleton } from "./_components/skeletons/AgenciesLoadingSkeleton";

import UserComponentsClient from "./_components/UserComponentsClient";
import {
  getCachedFeaturedAgencies,
  getCachedFeaturedListings,
} from "@/server/gets/cached";

export const metadata: Metadata = {
  title: "Недвижнини во Македонија",
  description: "Огласи за недвижнини во Македонија",
  keywords: [
    "realestate",
    "real estate",
    "недвижнини",
    "огласи",
    "агенции",
    "продажба",
    "изнајмување",
    "станови",
    "куќи",
    "земјишта",
  ],
  authors: [{ name: "Mario Krstevski", url: "https://mariok.mk" }],
  creator: "Mario Krstevski",
  publisher: "Adresa",
  twitter: {
    card: "summary_large_image",
    title: "Adresa.mk - Homepage",
    description: "Вебсајт за огласи за недвижнини",
    images: ["/twitter-image.png"],
  },
  openGraph: {
    title: "Adresa.mk - Homepage",
    description: "Вебсајт за огласи за недвижнини",
    images: ["/assets/adresa-share-og.png"],
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

export async function generateStaticParams() {
  return [{ locale: "mk" }, { locale: "en" }, { locale: "al" }];
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const featuredListingsPromise = getCachedFeaturedListings();
  const featuredAgenciesPromise = getCachedFeaturedAgencies();

  // TODO:
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
        <UserComponentsClient />
        <Suspense fallback={<ListingsLoadingSkeleton />}>
          <LatestListings />
        </Suspense>
        {/* <SuggestedProperties /> */}
        <Suspense fallback={<ListingsLoadingSkeleton />}>
          <FeaturedListings featuredListingsPromise={featuredListingsPromise} />
        </Suspense>
        {/* <Banner /> */}
        {/* <SuggestedAgencies /> */}
        <Suspense fallback={<AgenciesLoadingSkeleton />}>
          <FeaturedAgencies featuredAgenciesPromise={featuredAgenciesPromise} />
        </Suspense>
      </section>
    </main>
  );
}
