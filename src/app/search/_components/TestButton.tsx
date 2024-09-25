"use client";
import { Listing } from "@prisma/client";
export default function TestButton({
  listing,
}: {
  listing: Listing;
}) {
  return (
    <div>
      TextButton works
      <button
        onClick={() => {
          console.log("listing", listing);
        }}
      >
        SEE LISTING
      </button>
    </div>
  );
}
