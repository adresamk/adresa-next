"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Listing } from "@prisma/client";
import { LatLngExpression, divIcon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  LayerGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ListingMapCard from "./ListingMapCard";
import MapWithBounds from "./MapWithBounds";
import { useState, memo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Compass, Ghost, MapPinCheck } from "lucide-react";
import { cn, displayPrice } from "@/lib/utils";
import { renderToStaticMarkup } from "react-dom/server";

export default function SearchMap({ listings }: { listings: Listing[] }) {
  const [resultsFilters, setResultsFilters] = useState("");
  const [mapFilters, setMapFilters] = useState("");
  const [searchOnMove, setSearchOnMove] = useState(false);
  const [mapSearchedCounter, setMapSearchedCounter] = useState(0);
  const mapRef: React.RefObject<typeof MapContainer> = useRef(null);

  const skopjeLatLng: LatLngExpression = [41.9990607, 21.342318];
  const pin1: LatLngExpression = [42.009505818991286, 21.349934451934097];

  function handleMapMove(
    target: "resultsFilters" | "mapFilters" | "both",
    coordinates: string,
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
    <div className="order-2 mb-10 h-[300px] shrink-0 overflow-hidden border lg:sticky lg:top-[150px] lg:z-20 lg:h-[calc(100vh_-_150px)] lg:w-2/5">
      <div id="search-page-map" className="relative mb-10 h-full w-full">
        <aside className="absolute left-0 right-0 top-0 z-[1050] h-0 w-full text-center">
          <div
            className={cn(
              "mt-5 inline-block rounded-md bg-white shadow",
              !mapMovedWithoutSearching && "px-3.5 py-2.5",
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
                <Label className="font-semibold" htmlFor="search-on-pan">
                  Search as I move
                </Label>
              </div>
            )}
          </div>
        </aside>
        <aside className="absolute bottom-0 left-0 z-[1050]">
          <div className="rounded-tr-md bg-white px-3.5 py-2.5 text-sm shadow">
            View 300 of {listings.length} properties with a pin on the map
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
          key={`map-${mapSearchedCounter}`}
          center={skopjeLatLng}
          zoom={11}
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
            <Marker
              position={pin1}
              icon={divIcon({
                html: renderToStaticMarkup(
                  <div className="w-fit rounded border border-white bg-brand-light-blue px-1.5 py-1 font-medium text-white outline-black">
                    Test
                  </div>,
                ),
              })}
            >
              <Popup>
                <div>Mario 123</div>
              </Popup>
            </Marker>
            {listings.map((listing) => (
              <Marker
                icon={divIcon({
                  html: renderToStaticMarkup(
                    <div className="relative left-1/2 w-fit -translate-x-1/2 text-nowrap rounded-3xl border border-white bg-brand-light-blue px-1.5 py-1 font-medium text-white outline-black">
                      {displayPrice(listing.price)}
                    </div>,
                  ),
                })}
                key={listing.id}
                position={
                  [listing.latitude, listing.longitude] as LatLngExpression
                }
                eventHandlers={{
                  mouseover: (e) => {
                    // console.log(e.target);
                    // e.target._path.setAttribute("fill", "#35f3ff");
                    // e.target._path.setAttribute("stroke", "#35f3ff");
                    e.target.openPopup();
                  },
                  mouseout: (e) => {
                    e.target.closePopup();
                    // e.target._path.setAttribute("fill", "#0069fe");
                    // e.target._path.setAttribute("stroke", "#0069fe");
                  },
                }}
              >
                <Popup className="test" autoPan={false}>
                  <ListingMapCard listing={listing} />
                </Popup>
              </Marker>
            ))}
            {listings.map((listing) => (
              <CircleMarker
                key={listing.id}
                center={
                  [listing.latitude, listing.longitude] as LatLngExpression
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
            {/* <CircleMarker
              center={skopjeLatLng}
              className="relative"
              radius={8}
              fill={true}
              pathOptions={{
                color: "#0069fe",
                fillColor: "#0069fe",
                fillOpacity: 1,
              }}
            ></CircleMarker> */}
          </LayerGroup>
        </MapContainer>
      </div>
    </div>
  );
}
