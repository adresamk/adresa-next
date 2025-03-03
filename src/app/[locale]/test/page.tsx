"use client";

import {
  unpackOriginalSavedSearchParams,
  unpackSavedSearchParams,
} from "@/server/specific-utils/notifications.utils";
import { useEffect } from "react";

export default function TestPage() {
  //effect description
  useEffect(() => {
    const unpackedSearchParams = unpackOriginalSavedSearchParams(
      // "search/tt-rent/l-10001/c-commercial/pl-100/ph-300/s-new/t-apartment/al-5/ah-10",
      "/search/tt-sale/l-10037/c-residential/t-apartment",
    );

    console.log("unpackedSearchParams", unpackedSearchParams, false);
  }, []);
  return <div>Test</div>;
}
