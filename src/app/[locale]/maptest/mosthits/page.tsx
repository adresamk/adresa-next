import {
  getAllMunicipalitiesWithPlacesTranslated,
  getMunicipalitiesOptions,
} from "@/lib/data/macedonia/importantData";
import prismadb from "@/lib/db";
import { Listing, ListingStatus } from "@prisma/client";

interface MostHitsPageProps {}
export default async function MostHitsPage({}: MostHitsPageProps) {
  const listings = await prismadb.listing.groupBy({
    by: ["municipality"],
    where: {
      isAvailable: true,
      isPublished: true,
      status: ListingStatus.ACTIVE,
    },
    _count: {
      municipality: true,
    },
    orderBy: {
      _count: {
        municipality: "desc",
      },
    },
  });
  console.log(listings);
  const muniTranslated = getAllMunicipalitiesWithPlacesTranslated();
  const muniTranslatedMap = new Map(muniTranslated.map((m) => [m.value, m]));
  const translatedListingsMuni = listings.map((l) => ({
    ...l,
    label: muniTranslatedMap.get(l?.municipality || "")?.label,
  }));

  return (
    <div>
      <div>total Municipalities populated: {listings.length}</div>
      <div>
        total listings (that are ready to be viewed):{" "}
        {listings.reduce((acc, curr) => acc + curr._count.municipality, 0)}
      </div>
      {translatedListingsMuni.map((listing) => {
        return (
          <div key={listing.municipality} className="flex gap-3 px-6 py-2">
            <div>{listing.municipality ?? "ITS NULL"}</div>
            <div>{listing._count.municipality}</div>
            <div>{listing.label}</div>
          </div>
        );
      })}
    </div>
  );
}
