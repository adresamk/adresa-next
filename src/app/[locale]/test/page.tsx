"use client";

import { unpackSavedSearchParams } from "@/server/specific-utils/notifications.utils";
import { useEffect } from "react";

export default function TestPage() {
  //effect description
  useEffect(() => {
    const unpackedSearchParams = unpackSavedSearchParams(
      "/search/tt-sale/l-10010/c-residential",
    );

    console.log("unpackedSearchParams", unpackedSearchParams);
  }, []);
  return <div>Test</div>;
}
