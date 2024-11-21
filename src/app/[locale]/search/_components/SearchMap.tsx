"use client";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
// import "react-leaflet-markercluster/dist/styles.min.css";
// import MarkerClusterGroup from "react-leaflet-markercluster";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Agency, Listing } from "@prisma/client";
import L, { Icon, LatLngExpression, divIcon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  LayerGroup,
} from "react-leaflet";
import ListingMapCard from "./ListingMapCard";
import MapWithBounds from "./MapWithBounds";
import { useState, memo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Building, Compass, Ghost, MapPinCheck } from "lucide-react";
import { cn, displayPrice } from "@/lib/utils";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from "@/components/shared/MarkerClusterGroup";
import { createElementObject, createPathComponent } from "@react-leaflet/core";

export default function SearchMap({
  listings,
  agency,
}: {
  listings: Listing[];
  agency?: Agency;
}) {
  const [mapReady, setMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [resultsFilters, setResultsFilters] = useState("");
  const [mapFilters, setMapFilters] = useState("");
  const [searchOnMove, setSearchOnMove] = useState(false);
  const [mapSearchedCounter, setMapSearchedCounter] = useState(0);
  const mapRef: React.RefObject<typeof MapContainer> = useRef(null);

  const skopjeLatLng: LatLngExpression = [41.9990607, 21.342318];
  const pin1: LatLngExpression = [42.009505818991286, 21.349934451934097];
  const agencyLocation: LatLngExpression = [41.99564, 21.428277];
  useEffect(() => {
    if (typeof window === "undefined") return;

    // This fixes the missing icon issues
    if (!mapReady) {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
        iconUrl: "leaflet/images/marker-icon.png",
        shadowUrl: "leaflet/images/marker-shadow.png",
      });
      setMapReady(true);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        console.log("Removing map");
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapReady]);

  function getListingIcon(listing: Listing) {
    let htmlMarkup = null;
    if (listing.locationPrecision === "exact") {
      htmlMarkup = (
        <div className="relative left-1/2 w-fit -translate-x-1/2 text-nowrap rounded-3xl border border-white bg-brand-light-blue px-1.5 py-1 font-medium text-white outline-black">
          {displayPrice(listing.price)}
        </div>
      );
    }

    if (listing.locationPrecision === "approximate") {
      htmlMarkup = (
        <div className="relative -left-2 -top-2 h-4 w-4 rounded-full border border-white bg-brand-light-blue text-transparent"></div>
      );
    }

    if (listing.locationPrecision === "wide") {
      htmlMarkup = (
        <div className="relative -left-[3px] -top-[8px]">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="18px"
            height="18px"
            viewBox="0 0 512.000000 512.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
              fill="#0069fe"
              stroke="red"
              strokeWidth={2}
            >
              <path
                d="M2385 5114 c-670 -70 -1186 -403 -1440 -929 -115 -237 -185 -557
-185 -844 0 -446 336 -1197 983 -2196 277 -429 785 -1135 816 -1135 10 0 333
443 533 730 843 1212 1268 2083 1268 2598 0 286 -72 616 -184 847 -238 487
-697 810 -1296 910 -91 15 -412 28 -495 19z"
              />
            </g>
          </svg>
        </div>
      );
    }
    return divIcon({
      html: renderToStaticMarkup(htmlMarkup!),
    });
  }
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

  if (!mapReady) {
    return (
      <div className="order-2 mb-10 h-[300px] shrink-0 overflow-hidden border lg:sticky lg:top-[150px] lg:z-20 lg:h-[calc(100vh_-_150px)] lg:w-2/5">
        Loading map...
      </div>
    );
  }
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

        <MapContainer
          key={`map-${mapSearchedCounter}`}
          center={skopjeLatLng}
          // ref={(map) => {
          //   if (map) {
          //     mapInstanceRef.current = map;
          //   }
          // }}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          {/* <MapWithBounds
            mapSearchedCounter={mapSearchedCounter}
            searchOnMove={searchOnMove}
            handleMapMove={handleMapMove}
          /> */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LayerGroup>
            {listings.map((listing) => (
              <Marker
                icon={getListingIcon(listing)}
                key={listing.id}
                position={
                  [listing.latitude, listing.longitude] as LatLngExpression
                }
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  mouseout: (e) => {
                    e.target.closePopup();
                  },
                }}
              >
                <Popup className="test" autoPan={false}>
                  <ListingMapCard listing={listing} />
                </Popup>
              </Marker>
            ))}

            {agency && (
              <Marker
                position={agencyLocation}
                icon={
                  new Icon({
                    iconUrl:
                      "https://cdn-icons-png.flaticon.com/512/8/8214.png",
                    iconSize: [32, 32],
                  })
                }
              ></Marker>
            )}

            {false &&
              listings.map((listing) => (
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
