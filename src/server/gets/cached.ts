import { unstable_cache } from "next/cache";
import { getFeaturedAgencies, getFeaturedListings } from "./everything";

export const getCachedFeaturedListings = unstable_cache(
  async () => {
    const featuredListings = await getFeaturedListings();
    return featuredListings;
  },
  ["featured-listings"],
  {
    revalidate: 3600,
    tags: ["featured-listings-cache"],
  },
);

export const getCachedFeaturedAgencies = unstable_cache(
  async () => {
    const featuredAgencies = await getFeaturedAgencies();
    return featuredAgencies;
  },
  ["featured-agencies"],
  {
    revalidate: 3600,
    tags: ["featured-agencies-cache"],
  },
);
