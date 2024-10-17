import MyListingsList from "@/components/shared/MyListingsList";
import { Separator } from "@/components/ui/separator";

import { getUser } from "@/lib/auth";
import prismadb from "@/lib/db";

export default async function ProfileListingsPage() {
  const user = await getUser();

  if (!user) {
    return <div>User Missing </div>;
  }

  const myListings = await prismadb.listing.findMany({
    where: {
      userId: user.id,
    },
  });
  return (
    <div className="p-8 mt-4 ml-4 bg-white   rounded-lg shadow">
      <h3 className="text-2xl font-semibold mb-3 ">My Listings</h3>
      <Separator className="my-3" />

      <MyListingsList listings={myListings} user={user} />
    </div>
  );
}
