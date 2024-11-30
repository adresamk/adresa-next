// "use client";

import { ScanEye, ScanSearch, SearchCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import ContentCarousel from "./ContentCarousel";
import RecentlyViewedListingCard from "./RecentlyViewedListingCard";
import { getTranslations } from "next-intl/server";
import prismadb from "@/lib/db";

export default async function RecentlyViewedListings() {
  const t = await getTranslations();
  const searches: string[] = [];
  const listings = await prismadb.listing.findMany({
    take: 8,
    orderBy: {
      id: "desc",
    },
    skip: Math.floor(Math.random() * 10), // Assuming there are at least 1000 listings
  });
  return (
    <ContentCarousel
      icon={<ScanEye className="h-7 w-7" />}
      title={t("home.sections.lastOpenedListings.lastOpened")}
      items={listings}
      renderItem={(listing) => <RecentlyViewedListingCard listing={listing} />}
      contentClasses=""
      carouselItemContainerClasses="min-w-[336px]"
      carouselItemClasses="h-full"
    />
  );
}
// export default async function RecentlyViewedListings() {
//   const t = await getTranslations();
//   const listings = await prismadb.listing.findMany({
//     take: 6,
//     orderBy: {
//       id: "desc",
//     },
//     skip: Math.floor(Math.random() * 20), // Assuming there are at least 1000 listings
//   });
//   return (
//     <div className="mx-auto flex flex-col gap-3 px-12 pb-3 pt-6">
//       <h3 className="flex gap-4">
//         <SearchCheck /> {t("home.sections.lastOpened")}
//       </h3>
//       <Carousel
//         opts={{
//           align: "start",
//         }}
//       >
//         <CarouselContent className="max-w-[900px]">
//           {listings.map((listing) => (
//             <CarouselItem key={listing.id} className="basis-1/3">
//               <ListingCard listing={listing} />
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         <CarouselPrevious />
//         <CarouselNext />
//       </Carousel>
//     </div>
//   );
// }
