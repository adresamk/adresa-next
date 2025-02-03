import { parseQueryParams } from "@/lib/filters";
import { getAllListings } from "@/server/actions/listing.gets";
import { Feature, Listing, ListingFeature } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // const filters = extractFromUrl(request.url, "filters");
    // console.log(filters);
    const queryParams = request.nextUrl.searchParams;
    const path = queryParams.get("path");
    const f = queryParams.get("f");
    console.log("path", path);
    console.log("f", f);
    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }
    const parsedQueryParams = parseQueryParams(path.split("/"));
    // console.log("parsedQueryParams", parsedQueryParams);

    // console.log("parsedQueryParams", parsedQueryParams);
    let listings = await unstable_cache(
      async () => getAllListings(parsedQueryParams),
      ["listings", JSON.stringify(parsedQueryParams)],
      {
        revalidate: 60,
      },
    )();

    console.log("featuer kesys", f);
    if (f && f.length > 0) {
      const featureKeys = f.split(",");
      listings = listings.filter((listing, idx) => {
        const lwf = listing as Listing & {
          listingFeatures: (ListingFeature & {
            feature: Feature;
          })[];
        };

        const appliedFeaturesKeys = lwf.listingFeatures.map(
          (lf) => lf.feature.key,
        );
        console.log("appliedFeaturesKeys", appliedFeaturesKeys);
        return featureKeys.every((key) => appliedFeaturesKeys.includes(key));
        //
      });
    }
    // console.log("listings", listings.length);

    return NextResponse.json({ count: listings.length });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 },
    );
  }
}
