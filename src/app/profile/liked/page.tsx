import { getLikedListingsByUser } from "@/actions/listings";
import { Separator } from "@/components/ui/separator";
import MyLikedListings from "./_components/MyLikedListings";
import SuggestedAgencies from "@/app/SuggestedAgencies";
import { Button } from "@/components/ui/button";
import { HousePlus } from "lucide-react";

export default async function ProfileLikedPage() {
  const myLikedListings = await getLikedListingsByUser();
  return (
    <div>
      <div className="p-8 mt-4 ml-4 bg-white   rounded-lg shadow w-full">
        <h3 className="text-2xl font-semibold mb-3 ">
          Favorite Listings
        </h3>
        <Separator className="my-3" />
        <MyLikedListings listings={myLikedListings} />
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
      <div className="p-8 mt-4 ml-4 bg-white  overflow-x-auto  rounded-lg shadow">
        <SuggestedAgencies />
      </div>
    </div>
  );
}
