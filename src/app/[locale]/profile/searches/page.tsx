import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HousePlus, Search } from "lucide-react";
import MySavedSearchesList from "./_components/MySavedSearchesList";
import { get } from "http";
import { getMySavedSearches } from "@/server/actions/savedSearche.actions";

export default async function MySavedSearchesPage() {
  const mySavedSearches = await getMySavedSearches();
  return (
    <div className="w-full">
      <div className="ml-4 mt-4 w-full rounded-lg bg-white p-8 shadow">
        <h3 className="mb-3 flex items-center justify-between text-2xl font-semibold">
          Saved Searches
          <Button className="uppercase" size={"sm"}>
            <Search className="mr-2" /> New Search
          </Button>
        </h3>
        <Separator className="my-3" />
        <MySavedSearchesList savedSearches={mySavedSearches} />
      </div>
      <div className="ml-4 mt-4 flex h-[220px] items-center justify-between overflow-x-auto rounded-lg bg-white p-8 shadow">
        <div>
          <h3 className="text-2xl font-semibold">Hire Agencies</h3>
          <p>Let the agencies do all the hard work</p>
          <Button className="mt-3 uppercase">
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
