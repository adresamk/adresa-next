import { getListingsByIdForRecentlyViewed } from "@/server/actions/listing.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Reset the cookies for auth_session and auth-cookie-exists
  const { listingNumbers } = await request.json();
  const listings = await getListingsByIdForRecentlyViewed(listingNumbers);

  return NextResponse.json(listings);
}
