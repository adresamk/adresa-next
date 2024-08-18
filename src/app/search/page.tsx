"use client";

import Filters from "@/components/shared/filters/Filters";
import Listings from "./_components/Listings";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { listings } from "@/global/data";
import { Listing } from "@/global/types";

function Map({ listings }: { listings: Listing[] }) {
  return (
    <div
      className="w-2/5 border sticky top-[150px] z-20 shrink-0 order-2"
      style={{
        height: "calc(100vh - 150px)",
      }}
    >
      <div id="map" className="mb-10 w-full h-full relative">
        <aside className="left-0 absolute right-0 top-0 w-full z-40 h-0 text-center">
          <div className="inline-block mt-5  py-2.5 px-3.5 rounded-md shadow bg-white">
            <div className="flex items-center space-x-2">
              <Checkbox id="search-on-pan" />
              <Label
                className="font-semibold "
                htmlFor="search-on-pan"
              >
                Search as I move
              </Label>
            </div>
          </div>
        </aside>
        <aside className="absolute bottom-0 left-0 z-50">
          <div className="rounded-tr-md py-2.5 px-3.5 text-sm bg-white shadow">
            View 300 of {listings.length} properties with a pin on the
            map
          </div>
        </aside>
        <img
          src="/assets/map-example.png"
          alt=""
          className="h-100 object-cover max-w-max"
        />
      </div>
    </div>
  );
}
export default function SearchPage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="w-full ">
        <Filters />
        <section className="flex flex-col-reverse md:flex-row relative z-0 w-full">
          <Listings listings={listings} />
          <Map listings={listings} />
        </section>
      </div>
    </main>
  );
}
