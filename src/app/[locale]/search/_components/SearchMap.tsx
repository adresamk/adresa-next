"use client";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
// import "react-leaflet-markercluster/dist/styles.min.css";
// import MarkerClusterGroup from "react-leaflet-markercluster";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Agency, Listing } from "@prisma/client";
import L, { Icon, LatLngExpression, LeafletMouseEvent, divIcon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  LayerGroup,
  useMap,
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
import ZoomTracker from "./ZoomTracker";

export default function SearchMap({
  listings,
  agency,
}: {
  listings: Listing[];
  agency?: Agency;
}) {
  const [resultsFilters, setResultsFilters] = useState("");
  const [mapFilters, setMapFilters] = useState("");
  const [searchOnMove, setSearchOnMove] = useState(false);
  const [mapSearchedCounter, setMapSearchedCounter] = useState(0);
  const [zoom, setZoom] = useState(11);
  const mapRef = useRef<L.Map>(null);
  const popupRef = useRef<L.Popup>(null);
  const skopjeLatLng: LatLngExpression = [41.9990607, 21.342318];
  const agencyLocation: LatLngExpression = [41.99564, 21.428277];
  function getListingIcon(listing: Listing, zoom: number) {
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
        <div
          className={cn(
            "group relative -left-2 -top-2 h-4 w-4 rounded-full border border-white bg-brand-light-blue text-transparent",
            zoom === 16 && "hover:shadow-blue-glow",
            zoom === 17 && "hover:shadow-blue-glow-bigger",
            zoom >= 18 && "hover:shadow-blue-glow-biggest",
          )}
        ></div>
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

  const handlePopupPosition = (popup: L.Popup, position: LatLngExpression) => {
    const map = mapRef.current;
    if (!map) return;

    const mapBounds = map.getBounds();
    const popupWidth = 150; // Approximate width of the popup
    const offset = 10; // Margin from the marker

    if (mapBounds.contains(position)) {
      const popupLatLng = L.latLng(position);
      const markerPoint = map.project(popupLatLng);

      const offsetDirection =
        markerPoint.x + popupWidth + offset > map.getSize().x
          ? "left"
          : "right";

      const popupOptions: L.PopupOptions = {
        offset:
          offsetDirection === "right"
            ? [popupWidth / 2 + offset, 0]
            : [-popupWidth / 2 - offset, 0],
      };

      popup.setLatLng(position).options = popupOptions;
    }
  };
  let timeoutId: NodeJS.Timeout | null = null;

  //

  return (
    <div className="order-2 mb-10 h-[360px] shrink-0 overflow-hidden border lg:sticky lg:top-[150px] lg:z-20 lg:h-[calc(100vh_-_150px)] lg:w-2/5">
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
            View 300 {zoom} of {listings.length} properties with a pin on the
            map
          </div>
        </aside>

        <MapContainer
          key={`map-${mapSearchedCounter}`}
          center={skopjeLatLng}
          ref={mapRef}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <ZoomTracker onZoomChange={setZoom} />
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
            {listings.map((listing) => {
              const handleMouseOver = (e: LeafletMouseEvent) => {
                console.log(e);
                console.log(e.target);
                e.target.openPopup();
                const popupContainer = e.target.getPopup()._container;
                // setTimeout(() => {
                //   popupContainer.style.transform = "translate3d(0px, 0px, 0px)";
                //   popupContainer.style.top = "20px";
                //   popupContainer.style.bottom = "unset";
                //   popupContainer.style.left = "20px";
                //   popupContainer.addEventListener("mouseout", () => {
                //     setTimeout(() => {
                //       e.target.closePopup();
                //     }, 50);
                //   });
                // }, 5);
                // console.log(popupContainer);
              };

              return (
                <Marker
                  icon={getListingIcon(listing, zoom)}
                  key={listing.id}
                  position={
                    [listing.latitude, listing.longitude] as LatLngExpression
                  }
                  eventHandlers={{
                    click: (e) => {
                      // hopefully this catches the click before render
                      setSearchOnMove(false);
                    },
                    // mouseover: handleMouseOver,
                    // mouseout: handleMouseOut,
                  }}
                >
                  <Popup
                    ref={popupRef}
                    autoPan={true}
                    autoPanPadding={[10, 10]}
                    // // keepInView={true}
                    // eventHandlers={{
                    //   popupopen: handlePopupOpened,
                    //   load: handlePopupOpened,
                    //   popupclose: handlePopupClosed,
                    //   // mouseover: handlePopupMouseEnter,
                    //   // mouseout: handlePopupMouseLeave,
                    // }}
                  >
                    <ListingMapCard listing={listing} />
                  </Popup>
                </Marker>
              );
            })}

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
          </LayerGroup>
        </MapContainer>
      </div>
    </div>
  );
}
