"use client";
import {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import "leaflet/dist/leaflet.css";
import "./mapCustom.css";
// import "react-leaflet-markercluster/dist/styles.min.css";
// import MarkerClusterGroup from "react-leaflet-markercluster";
// import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Agency, Listing } from "@prisma/client";
import L, {
  Icon,
  latLng,
  LatLng,
  LatLngBounds,
  LatLngBoundsExpression,
  LatLngExpression,
  LatLngTuple,
  map,
} from "leaflet";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  LayerGroup,
  useMapEvent,
  Polygon,
  Popup,
} from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Check, Compass, Pencil, RefreshCcw, X } from "lucide-react";
import { cn, readFromLocalStorage, writeToLocalStorage } from "@/lib/utils";
import ZoomTracker from "./ZoomTracker";
import ActiveListing from "./ActiveListing";
import { useTranslations } from "next-intl";
import { getMapPinIcon } from "@/components/shared/map/helpers";
import { northMacedoniaCoordinates } from "@/lib/data/macedoniaOld/importantData";
import { useQueryStates } from "nuqs";
import { mapRelatedFiltersParsers } from "@/app/[locale]/searchParams";
import { Checkbox } from "@/components/ui/checkbox";
import { replaceFilterInUrl } from "@/lib/filters";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { isPointWithinPolygon } from "@/app/[locale]/listing/edit/[listingNumber]/[step]/_components/mapHelpers";

const skopjeLatLng: LatLngExpression = [41.9990607, 21.342318];
const agencyLocation: LatLngExpression = [41.99564, 21.428277];
const northMacedoniaBounds: LatLngBoundsExpression = [
  [41.01721057822846, 19.649047851562504],
  [42.24071874922669, 23.499755859375004],
];

export default function SearchMap({
  listings,
  agency,
}: {
  listings: Listing[];
  agency?: Agency;
}) {
  // console.log("SearchMap render", new Date().getTime());

  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();
  // to toggle the checkbox
  const [searchOnMove, setSearchOnMove] = useState(false);

  const [boundsAreUpdatedAfterPan, setBoundsAreUpdatedAfterPan] =
    useState(false);

  const loadedMapBounds = useRef<LatLngBoundsExpression | undefined>(undefined);
  const maybeNewQP = useRef<
    | {
        NELat: number;
        NELng: number;
        SWLat: number;
        SWLng: number;
        zoom: number;
      }
    | undefined
  >(undefined);

  let [boundingBoxCoordinatesQP, setBoundingBoxCoordinatesQP] = useQueryStates(
    mapRelatedFiltersParsers,
    {
      shallow: false,
      history: "replace",
    },
  );
  const [polygonIsDrawn, setPolygonIsDrawn] = useState<LatLngTuple[] | null>(
    null,
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPolygonCoords, setDrawnPolygonCoords] = useState<LatLngTuple[]>(
    [],
  );
  const [activeListing, setActiveListing] = useState<Listing | null>(null);
  const [zoom, setZoom] = useState(11);
  const mapRef = useRef<L.Map>(null);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(
    null,
  );

  useLayoutEffect(() => {
    //@ts-ignore
    window.setSelectedListingId = setSelectedListingId;
  }, [selectedListingId]);

  const coordsArray = listings.reduce((acc, curr) => {
    if (curr.latitude && curr.longitude) {
      acc.push([curr.latitude, curr.longitude]);
    }
    return acc;
  }, [] as LatLngTuple[]);

  // console.log("coordsArray", coordsArray);

  useEffect(() => {
    if (mapRef.current && searchParams) {
      const SWLat = searchParams.get("SWLat");
      const SWLng = searchParams.get("SWLng");
      const NELat = searchParams.get("NELat");
      const NELng = searchParams.get("NELng");
      // const zoom = searchParams.get("zoom");
      if (SWLat && SWLng && NELat && NELng) {
        const newBounds = L.latLngBounds(
          [Number(SWLat), Number(SWLng)],
          [Number(NELat), Number(NELng)],
        );
        mapRef.current.fitBounds(newBounds, {
          padding: [30, 30],
        });
      }
      // mapRef.current.setView(skopjeLatLng, 11);
    }
  }, [searchParams]);

  //effect description
  useEffect(() => {
    console.log("isDrawing", isDrawing);
    if (isDrawing) {
      console.log(mapRef.current);
      // @ts-ignore
      mapRef.current?._container.classList.add("leaflet-drawing");
    } else {
      // @ts-ignore
      mapRef.current?._container.classList.remove("leaflet-drawing");

      // mapRef.current?.setStyle({ cursor: "grab" });
    }
  }, [isDrawing]);
  // Calculate bounds based on listings or get from localStorage
  const bounds =
    coordsArray.length > 0
      ? L.latLngBounds(coordsArray)
      : (() => {
          const storedBounds = readFromLocalStorage("map-bounds");
          if (storedBounds) {
            // Convert stored bounds back to Leaflet bounds
            return L.latLngBounds(
              [storedBounds._southWest.lat, storedBounds._southWest.lng],
              [storedBounds._northEast.lat, storedBounds._northEast.lng],
            );
          }
          return L.latLngBounds([
            [0, 0],
            [0, 0],
          ]); // fallback
        })();

  // Update localStorage when we have valid bounds
  useEffect(() => {
    if (coordsArray.length > 0) {
      writeToLocalStorage("map-bounds", bounds);
      loadedMapBounds.current = bounds;
    }
  }, [coordsArray.length, bounds]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const handleMoveEnd = () => {
      const currentBounds = map.getBounds();
      const startingMapBounds = loadedMapBounds.current as LatLngBounds;

      const mapWasMoved =
        startingMapBounds &&
        startingMapBounds.getSouthWest().lat !==
          currentBounds.getSouthWest().lat;

      if (mapWasMoved) {
        // console.log(searchOnMove);

        if (searchOnMove) {
          const newQP = {
            NELat: currentBounds.getNorthEast().lat,
            NELng: currentBounds.getNorthEast().lng,
            SWLat: currentBounds.getSouthWest().lat,
            SWLng: currentBounds.getSouthWest().lng,
            zoom: map.getZoom(),
          };
          // setBoundingBoxCoordinatesQP(newQP);
          if (pathname) {
            let newPath = replaceFilterInUrl(
              pathname,
              "location",
              "ms",
              new URLSearchParams({
                NELat: newQP.NELat.toString(),
                NELng: newQP.NELng.toString(),
                SWLat: newQP.SWLat.toString(),
                SWLng: newQP.SWLng.toString(),
                zoom: newQP.zoom.toString(),
              }) as ReadonlyURLSearchParams,
            );
            // newPath =
            //   newPath +
            //   `?${new URLSearchParams({
            //     NELat: newQP.NELat.toString(),
            //     NELng: newQP.NELng.toString(),
            //     SWLat: newQP.SWLat.toString(),
            //     SWLng: newQP.SWLng.toString(),
            //     zoom: newQP.zoom.toString(),
            //   })}`;
            router.push(newPath);
          }
          setBoundsAreUpdatedAfterPan(false);
          loadedMapBounds.current = L.latLngBounds(
            [newQP.SWLat, newQP.SWLng],
            [newQP.NELat, newQP.NELng],
          );
        } else {
          setBoundsAreUpdatedAfterPan(true);
          maybeNewQP.current = {
            NELat: currentBounds.getNorthEast().lat,
            NELng: currentBounds.getNorthEast().lng,
            SWLat: currentBounds.getSouthWest().lat,
            SWLng: currentBounds.getSouthWest().lng,
            zoom: map.getZoom(),
          };
        }
      }

      // Save to localStorage if needed
      writeToLocalStorage("map-bounds", currentBounds);
    };

    // Add the event listener
    setTimeout(() => {
      map.on("moveend", handleMoveEnd);
    }, 10);

    // Cleanup
    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [searchOnMove, boundsAreUpdatedAfterPan, setBoundingBoxCoordinatesQP]);

  const mapMovedWithoutSearching = false;

  const MapClickHandler = () => {
    useMapEvent("click", (e) => {
      setActiveListing(null);
      if (isDrawing) {
        // console.log("eMapClickHandler", e);
        setDrawnPolygonCoords((prev) => [
          ...prev,
          [e.latlng.lat, e.latlng.lng],
        ]);
      }
    });

    return null;
  };

  function isPolygonClosed() {
    if (drawnPolygonCoords.length > 2) {
      if (
        drawnPolygonCoords[0][0] ===
          drawnPolygonCoords[drawnPolygonCoords.length - 1][0] &&
        drawnPolygonCoords[0][1] ===
          drawnPolygonCoords[drawnPolygonCoords.length - 1][1]
      ) {
        return true;
      }
    }
    return false;
  }
  const handleCheckedChange = useCallback((newState: boolean) => {
    setSearchOnMove(newState);
  }, []);

  return (
    <div className="order-2 mb-10 h-[300px] shrink-0 overflow-hidden border md:h-[380px] lg:sticky lg:top-[150px] lg:z-20 lg:h-[calc(100vh_-_150px)] lg:flex-row-reverse">
      <div
        id="search-page-map"
        className={cn(
          "relative mb-10 h-full w-full",
          isDrawing && "leaflet-drawing",
        )}
      >
        {!isDrawing && (
          <aside className="absolute left-0 right-0 top-0 z-[1050] h-0 w-full text-center">
            <div
              className={cn(
                "mt-2 inline-block rounded-md bg-white shadow",
                !boundsAreUpdatedAfterPan && "px-3.5 py-2.5",
              )}
            >
              {boundsAreUpdatedAfterPan ? (
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    if (maybeNewQP.current) {
                      if (pathname) {
                        let newPath = replaceFilterInUrl(
                          pathname,
                          "location",
                          "ms",
                          new URLSearchParams({
                            NELat: maybeNewQP.current.NELat.toString(),
                            NELng: maybeNewQP.current.NELng.toString(),
                            SWLat: maybeNewQP.current.SWLat.toString(),
                            SWLng: maybeNewQP.current.SWLng.toString(),
                            zoom: maybeNewQP.current.zoom.toString(),
                          }) as ReadonlyURLSearchParams,
                        );
                        // newPath =
                        //   newPath +
                        //   `?${new URLSearchParams({
                        //     NELat: maybeNewQP.current.NELat.toString(),
                        //     NELng: maybeNewQP.current.NELng.toString(),
                        //     SWLat: maybeNewQP.current.SWLat.toString(),
                        //     SWLng: maybeNewQP.current.SWLng.toString(),
                        //     zoom: maybeNewQP.current.zoom.toString(),
                        //   })}`;
                        router.replace(newPath);
                      }
                      // setBoundingBoxCoordinatesQP(maybeNewQP.current);
                      setBoundsAreUpdatedAfterPan(false);
                      loadedMapBounds.current = L.latLngBounds(
                        [maybeNewQP.current.SWLat, maybeNewQP.current.SWLng],
                        [maybeNewQP.current.NELat, maybeNewQP.current.NELng],
                      );
                    }
                  }}
                >
                  <Compass className="mr-2" /> {t("map.searchInArea")}
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="search-on-pan"
                    checked={searchOnMove}
                    onCheckedChange={handleCheckedChange}
                  />
                  <Label className="font-semibold" htmlFor="search-on-pan">
                    {t("map.searchAsMove")}
                  </Label>
                </div>
              )}
            </div>
          </aside>
        )}
        {isDrawing && (
          <aside className="absolute left-0 right-0 top-0 z-[1050] h-0 w-full text-center">
            <div className="mt-2 inline-block rounded-md bg-white shadow">
              {isPolygonClosed() ? (
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    setPolygonIsDrawn(drawnPolygonCoords);
                    setDrawnPolygonCoords([]);
                    setIsDrawing(false);
                  }}
                >
                  <Check className="mr-2 h-3 w-3" />
                  Done
                </Button>
              ) : (
                <Button variant={"ghost"} onClick={() => setIsDrawing(false)}>
                  <X className="mr-2 h-3 w-3" />
                  Cancel
                </Button>
              )}

              {drawnPolygonCoords.length > 0 && (
                <Button
                  variant={"ghost"}
                  onClick={() => setDrawnPolygonCoords([])}
                >
                  <RefreshCcw className="mr-2 h-3 w-3" />
                  Reset
                </Button>
              )}
            </div>
          </aside>
        )}
        <aside className="absolute bottom-[42px] left-2 z-[1050]">
          <ActiveListing listing={activeListing} />
        </aside>
        <aside className="absolute bottom-0 left-0 z-[1050]">
          <div className="rounded-tr-md bg-white px-2.5 py-1.5 text-xs shadow-lg md:text-sm">
            {t("map.viewProperties", {
              listingsLength: listings.length,
            })}
          </div>
        </aside>
        <aside className="absolute bottom-[20px] right-[36px] z-[1050] rounded">
          <div className="rounded bg-white text-xs shadow-lg md:text-sm">
            <Button variant={"ghost"} onClick={() => setIsDrawing(!isDrawing)}>
              <Pencil className="mr-2 h-4 w-4" />
              Draw
            </Button>
          </div>
        </aside>

        <MapContainer
          key={`map-search`}
          ref={mapRef}
          // className={cn(isDrawing && "cursor-crosshair")}
          bounds={bounds}
          boundsOptions={{ padding: [30, 30], animate: true }}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <ZoomTracker onZoomChange={setZoom} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />
          {isDrawing && (
            <LayerGroup>
              <Polygon
                positions={drawnPolygonCoords}
                pathOptions={{ color: "red" }}
              ></Polygon>
              {false &&
                drawnPolygonCoords.length > 0 &&
                drawnPolygonCoords.map((coord, idx) => (
                  <CircleMarker
                    eventHandlers={{
                      click: (e) => {
                        setDrawnPolygonCoords((prev) => [
                          ...prev,
                          [coord[0], coord[1]],
                        ]);
                      },
                    }}
                    key={idx}
                    center={coord}
                    radius={8}
                    pathOptions={{ color: "blue" }}
                  />
                ))}
            </LayerGroup>
          )}
          {!isDrawing && (
            <LayerGroup>
              {polygonIsDrawn && (
                <Polygon
                  positions={polygonIsDrawn}
                  pathOptions={{ color: "red" }}
                >
                  {/* <Popup>
                    <div className="flex items-center space-x-2 p-2">
                      <Button
                        variant={"ghost"}
                        onClick={() => {
                          setIsDrawing(false);
                          setPolygonIsDrawn(null);
                          setDrawnPolygonCoords([]);
                        }}
                      >
                        Remove Area Search
                      </Button>
                    </div>
                  </Popup> */}
                </Polygon>
              )}
              {listings
                .toSorted((a, b) => (a.isPaidPromo ? -1 : 1))
                .map((listing, idx) => {
                  if (!listing.latitude || !listing.longitude) {
                    return null;
                  }
                  const location: LatLngExpression = [
                    listing.latitude,
                    listing.longitude,
                  ];

                  if (polygonIsDrawn) {
                    const isInsidePolygon = isPointWithinPolygon(
                      latLng(listing.latitude, listing.longitude),
                      [[polygonIsDrawn]] as LatLngExpression[][][],
                    );
                    if (!isInsidePolygon) {
                      return null;
                    }
                  }

                  return [
                    <Marker
                      icon={getMapPinIcon(
                        "S",
                        listing.locationPrecision,
                        zoom,
                        listing.isPaidPromo,
                        selectedListingId === listing.id,
                        listing,
                        idx,
                      )}
                      key={listing.id}
                      position={location}
                      eventHandlers={{
                        click: (e) => {
                          setActiveListing(listing);
                        },
                      }}
                    ></Marker>,
                    // <Circle
                    //   key={`circle-${listing.id}`}
                    //   center={location}
                    //   radius={4}
                    //   pathOptions={{ color: "red" }}
                    // />,
                  ];
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

              {polygonIsDrawn && (
                <Marker
                  eventHandlers={{
                    click: (e) => {
                      setIsDrawing(false);
                      setPolygonIsDrawn(null);
                      setDrawnPolygonCoords([]);
                    },
                  }}
                  key={"blabla"}
                  position={polygonIsDrawn[0]}
                  icon={
                    new Icon({
                      iconUrl: "/assets/icons/remove-x.png",
                      iconSize: [32, 32],
                    })
                  }
                />
              )}
            </LayerGroup>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
