import { parseQueryParams } from "@/lib/filters";
import { getAllListings } from "@/server/actions/listing.gets";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // const filters = extractFromUrl(request.url, "filters");
    // console.log(filters);
    const queryParams = request.nextUrl.searchParams;
    const path = queryParams.get("path");
    console.log("path", path);
    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }
    const parsedQueryParams = parseQueryParams(path.split("/"));
    // console.log("parsedQueryParams", parsedQueryParams);

    const listings = await unstable_cache(
      async () => getAllListings(parsedQueryParams),
      ["listings", JSON.stringify(parsedQueryParams)],
      {
        revalidate: 60,
      },
    )();
    // console.log("listings", listings.length);

    return NextResponse.json({ count: listings.length });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 },
    );
  }
}
