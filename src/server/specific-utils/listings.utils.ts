import { Listing } from "@prisma/client";

export function figureOutTags(listing: Listing): string[] {
  let tags: string[] = [];

  if (listing.isPaidPromo) {
    tags.push("featured");
  }
  const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
  if (listing.publishedAt && listing.publishedAt > sevenDaysAgo) {
    tags.push("new");
  }

  if (listing.transactionType === "rent") {
    tags.push("forRent");
  }
  if (listing.transactionType === "sale") {
    tags.push("forSale");
  }

  if (listing.userId) {
    tags.push("fromUser");
  }
  if (listing.agencyId) {
    // 10 is our own agency for all of the scraped user listings
    if (listing.agencyId === 10) {
      tags.push("fromUser");
    } else {
      tags.push("fromAgency");
    }
  }
  return tags;
}
