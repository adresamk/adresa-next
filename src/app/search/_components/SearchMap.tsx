import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Listing } from "@/global/types";
export default function SearchMap({
  listings,
}: {
  listings: Listing[];
}) {
  return (
    <div className="lg:w-2/5 mb-10 border lg:sticky lg:top-[150px] lg:z-20 shrink-0 order-2 h-[300px] lg:h-[calc(100vh_-_150px)] overflow-hidden">
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
        <div className="overflow-hidden lg:h-[calc(100vh_-_150px)]">
          <img
            src="/assets/map-example.png"
            alt=""
            className="h-100 object-cover max-w-max"
          />
        </div>
      </div>
    </div>
  );
}
