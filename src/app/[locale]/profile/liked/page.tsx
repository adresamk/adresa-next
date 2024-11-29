import { Separator } from "@/components/ui/separator";
import MyLikedListings from "./_components/MyLikedListings";
import SuggestedAgencies from "@/app/[locale]/_components/SuggestedAgencies";
import { Button } from "@/components/ui/button";
import { HousePlus } from "lucide-react";
import { getLikedListingsByUser } from "@/server/actions/listing.actions";

export default async function ProfileLikedPage() {
  const myLikedListings = await getLikedListingsByUser();
  return (
    <div>
      <div className="ml-4 mt-4 w-full rounded-lg bg-white p-8 shadow">
        <h3 className="mb-3 text-2xl font-semibold">Favorite Listings</h3>
        <Separator className="my-3" />
        <MyLikedListings listings={myLikedListings} />
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/saved-listings-bg1.png" alt="Image" />
        </div>
      </div>
      <div className="ml-4 mt-4 overflow-x-auto rounded-lg bg-white p-8 shadow">
        <SuggestedAgencies />
      </div>
    </div>
  );
}
