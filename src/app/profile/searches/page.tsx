import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HousePlus, Search } from "lucide-react";
import MySavedSearchesList from "./_components/MySavedSearchesList";

const mySavedSearches: any[] = [
  {
    id: 1,
    transactionType: "rent",
    type: "apartment",
    location: "Lekki",
    manucipality: "Lagos",
    listingsCount: 10,
    newListingsCount: 5,
    img: "/assets/saved-search-map-polygon.png",
    isNotificationOn: true,
    notificationInterval: "daily",
  },
  {
    id: 2,
    transactionType: "buy",
    type: "house",
    location: "Ikeja",
    manucipality: "Lagos",
    listingsCount: 14,
    newListingsCount: 5,
    img: "/assets/saved-search-map-polygon.png",
    isNotificationOn: false,
    notificationInterval: "weekly",
  },
  {
    id: 3,
    transactionType: "rent",
    type: "apartment",
    location: "Lekki",
    manucipality: "Lagos",
    listingsCount: 110,
    newListingsCount: 2,
    img: "/assets/saved-search-map-polygon.png",
    isNotificationOn: true,
    notificationInterval: "live",
  },
];
export default function MySavedSearchesPage() {
  return (
    <div className="w-full">
      <div className="p-8 mt-4 ml-4 bg-white   rounded-lg shadow w-full">
        <h3 className=" flex justify-between items-center text-2xl font-semibold mb-3 ">
          Saved Searches
          <Button className="uppercase" size={"sm"}>
            <Search className="mr-2" /> New Search
          </Button>
        </h3>
        <Separator className="my-3" />
        <MySavedSearchesList savedSearches={mySavedSearches} />
      </div>
      <div className="flex justify-between items-center p-8 mt-4 ml-4 bg-white h-[220px]  overflow-x-auto  rounded-lg shadow">
        <div>
          <h3 className="font-semibold text-2xl">Hire Agencies</h3>
          <p>Let the agencies do all the hard work</p>
          <Button className="uppercase mt-3">
            <HousePlus className="mr-2" /> Create Search
          </Button>
        </div>
        <div>
          <img src="/assets/saved-listings-bg1.png" alt="Image" />
        </div>
      </div>
    </div>
  );
}
