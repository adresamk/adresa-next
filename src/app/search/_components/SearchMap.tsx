"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Listing } from "@prisma/client";
import { LatLngExpression } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Circle,
  LayerGroup,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ListingMapCard from "./ListingMapCard";
import MapWithBounds from "./MapWithBounds";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Compass, Ghost } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchMap({
  listings,
}: {
  listings: Listing[];
}) {
  const [resultsFilters, setResultsFilters] = useState("");
  const [mapFilters, setMapFilters] = useState("");
  const [searchOnMove, setSearchOnMove] = useState(false);
  const [mapSearchedCounter, setMapSearchedCounter] = useState(0);

  const skopjeLatLng: LatLngExpression = [41.9990607, 21.342318];
  function handleMapMove(
    target: "resultsFilters" | "mapFilters" | "both",
    coordinates: string
  ) {
    if (target === "both") {
      setResultsFilters(coordinates);
      setMapFilters(coordinates);
      // setLastMapMoveCoordinates(coordinates);
    } else if (target === "resultsFilters") {
      setResultsFilters(coordinates);
      // setLastMapMoveCoordinates(coordinates);
    } else if (target === "mapFilters") {
      setMapFilters(coordinates);
    }
  }
  const mapMovedWithoutSearching = resultsFilters !== mapFilters;
  return (
    <div className="lg:w-2/5 mb-10 border lg:sticky lg:top-[150px] lg:z-20 shrink-0 order-2 h-[300px] lg:h-[calc(100vh_-_150px)] overflow-hidden">
      <div
        id="search-page-map"
        className="mb-10 w-full h-full relative"
      >
        <aside className="left-0 absolute right-0 top-0 w-full z-[1050] h-0 text-center">
          <div
            className={cn(
              "inline-block mt-5  rounded-md shadow bg-white",
              !mapMovedWithoutSearching && "py-2.5 px-3.5 "
            )}
          >
            {/* <div>
              {resultsFilters}
              {mapFilters}
            </div> */}
            {mapMovedWithoutSearching ? (
              <Button
                variant={"ghost"}
                onClick={() => {
                  setMapSearchedCounter((prev) => prev + 1);
                }}
              >
                <Compass className="mr-2" /> Search in this area
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="search-on-pan"
                  checked={searchOnMove}
                  onCheckedChange={(newState: boolean) => {
                    setSearchOnMove(newState);
                  }}
                />
                <Label
                  className="font-semibold "
                  htmlFor="search-on-pan"
                >
                  Search as I move
                </Label>
              </div>
            )}
          </div>
        </aside>
        <aside className="absolute bottom-0 left-0 z-[1050]">
          <div className="rounded-tr-md py-2.5 px-3.5 text-sm bg-white shadow">
            View 300 of {listings.length} properties with a pin on the
            map
          </div>
        </aside>
        {/* <div className="overflow-hidden lg:h-[calc(100vh_-_150px)]">
          <img
            src="/assets/map-example.png"
            alt=""
            className="h-100 object-cover max-w-max rounded"
          />
        </div> */}

        <MapContainer
          center={skopjeLatLng}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <MapWithBounds
            mapSearchedCounter={mapSearchedCounter}
            searchOnMove={searchOnMove}
            handleMapMove={handleMapMove}
          />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LayerGroup>
            {listings.map((listing) => (
              <CircleMarker
                key={listing.id}
                center={
                  [
                    listing.latitude,
                    listing.longitude,
                  ] as LatLngExpression
                }
                className="relative"
                radius={8}
                fill={true}
                pathOptions={{
                  color: "#0069fe",
                  fillColor: "#0069fe",
                  fillOpacity: 1,
                }}
                eventHandlers={{
                  mouseover: (e) => {
                    // console.log(e.target);
                    e.target._path.setAttribute("fill", "#35f3ff");
                    e.target._path.setAttribute("stroke", "#35f3ff");
                    e.target.openPopup();
                  },
                  mouseout: (e) => {
                    e.target.closePopup();
                    e.target._path.setAttribute("fill", "#0069fe");
                    e.target._path.setAttribute("stroke", "#0069fe");
                  },
                }}
              >
                <Popup className="test" autoPan={false}>
                  <ListingMapCard listing={listing} />
                </Popup>
              </CircleMarker>
            ))}
            <CircleMarker
              center={skopjeLatLng}
              className="relative"
              radius={8}
              fill={true}
              pathOptions={{
                color: "#0069fe",
                fillColor: "#0069fe",
                fillOpacity: 1,
              }}
            ></CircleMarker>
          </LayerGroup>
        </MapContainer>
      </div>
    </div>
  );
}
