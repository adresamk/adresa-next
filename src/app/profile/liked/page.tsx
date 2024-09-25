import { getLikedListingsByUser } from "@/actions/listings";
import { Separator } from "@/components/ui/separator";
import MyListingsListList from "./_components/MyLikedListingsList";

export default async function ProfileLikedPage() {
  const myLikedListings = getLikedListingsByUser();
  return (
    <div className="p-8 mt-4 ml-4 bg-white   rounded-lg shadow">
      <h3 className="text-2xl font-semibold mb-3 ">My Listings</h3>
      <Separator className="my-3" />
      <MyLikedListingsList listings={myLikedListings} />
    </div>
  );
}
