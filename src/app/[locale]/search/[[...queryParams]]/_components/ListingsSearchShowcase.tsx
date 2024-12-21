import { Listing } from "@prisma/client";

import { ListingDescriptions, UploadedImageData } from "@/types/listing.types";
import SearchShowcase from "./SearchShowcase";
import { useLocale } from "next-intl";
import { getLocale } from "next-intl/server";

export default async function ListingsSearchShowcase({
  listing,
}: {
  listing: Listing;
}) {
  const locale = await getLocale();
  const images = listing.images as UploadedImageData[];
  const description =
    listing[`${locale}Description` as keyof ListingDescriptions] || "";

  return (
    <SearchShowcase
      listing={listing}
      images={images}
      description={description}
    />
  );
}
