"use client";
import { Listing } from "@prisma/client";
import ListingActions from "./ListingActions";
import { cn, formatNumberWithDelimiter } from "@/lib/utils";
import { useEffect, useState } from "react";
export default function StickyControls({
  listing,
  isFavorited,
}: {
  listing: Listing;
  isFavorited: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollThreshold = 300; // Adjust this value
    if (window.scrollY > scrollThreshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <section
      className={cn(
        "left-0 right-0 top-0 z-[500] flex h-20 items-center overflow-hidden bg-white py-2.5 shadow-md",
        isVisible ? "fixed opacity-100" : "hidden opacity-0",
      )}
    >
      <div className="flex w-full px-5">
        <div className="relative flex w-full flex-1 flex-shrink flex-nowrap items-center pl-[80px]">
          <div className="absolute left-0 h-20 w-[72px]">
            <img
              src={listing.mainImage || ""}
              className="relateive h-full w-full object-cover object-center"
              loading="lazy"
              alt="Main image small"
            />
          </div>
          <div className="flex-shrink-0 flex-grow-0">
            <strong className="block capitalize">
              {listing.type}, {listing.area}m²
            </strong>
            <span className="block text-xs">{listing.address}</span>
          </div>
          <div className="flex-1 flex-shrink pl-[8%]">
            <div className="font-semibold">
              <span>
                ${formatNumberWithDelimiter(listing.price?.toString() || "")}
              </span>
            </div>
          </div>
        </div>
        <ListingActions isFavorited={isFavorited} listing={listing} />
      </div>
    </section>
  );
}
