import prismadb from "@/lib/db";
import { unstable_cache } from "next/cache";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const features = await unstable_cache(
      async () => {
        return prismadb.feature.findMany();
      },
      ["features"],
      {
        revalidate: 360000, // Cache for 100 hours
        tags: ["features"],
      },
    )();

    return NextResponse.json({ features });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 },
    );
  }
}
