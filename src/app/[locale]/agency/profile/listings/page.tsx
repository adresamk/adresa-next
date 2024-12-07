import MyListingsList from "@/components/shared/profile/MyListingsList";
import { Separator } from "@/components/ui/separator";
import { redirect } from "@/i18n/routing";

import { getUser } from "@/lib/auth";
import prismadb from "@/lib/db";
import { getCurrentUser } from "@/lib/sessions";

export default async function ProfileListingsPage() {
  const { isAuthorized, agency } = await getCurrentUser();

  if (isAuthorized && !agency) {
    redirect({ href: "/agency/profile/details", locale: "mk" });
  }

  // if (!user) {
  //   return <div>User Missing </div>;
  // }

  // const myListings = await prismadb.listing.findMany({
  //   where: {
  //     userId: user.id,
  //   },
  // });
  return (
    <div className="ml-4 mt-4 rounded-lg bg-white p-8 shadow">
      <h3 className="mb-3 text-2xl font-semibold">My Listings</h3>
      <Separator className="my-3" />

      <MyListingsList listings={myListings} user={user} />
    </div>
  );
}
