"use client";

import LastSearches from "./LastSearches";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import UserGreeting from "./UserGreeting";
import RecentlyViewedListings from "./RecentlyViewedListings";

export default function UserComponents() {
  const user = useCurrentUser((store) => store.user);

  if (!user) return null;
  return (
    <>
      <UserGreeting user={user} />
      {/* Comes from LS, but needs to go to API for the newest listings count */}
      {/* en_recentSearches */}
      {/* en_latestSearchedGeographies */}
      <LastSearches />
      {/* Comes from LS or COOKIES, keep last search there */},
      {/* en_recentlyViewedProperties */}
      {/* Latest Searches ? */}
      <RecentlyViewedListings />
    </>
  );
}
