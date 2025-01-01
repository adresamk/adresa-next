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
// import "react-leaflet-markercluster/dist/styles.min.css";
// import MarkerClusterGroup from "react-leaflet-markercluster";
// import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Agency, Listing } from "@prisma/client";
import L, {
  Icon,
  LatLngBounds,
  LatLngBoundsExpression,
  LatLngExpression,
  LatLngTuple,
} from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  LayerGroup,
  useMapEvent,
} from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { cn, readFromLocalStorage, writeToLocalStorage } from "@/lib/utils";
import ZoomTracker from "./ZoomTracker";
import ActiveListing from "./ActiveListing";
import { useTranslations } from "next-intl";
import { getMapPinIcon } from "@/components/shared/map/helpers";
import { northMacedoniaCoordinates } from "@/lib/data/macedoniaOld/importantData";
import { useQueryStates } from "nuqs";
import { mapRelatedFiltersParsers } from "@/app/[locale]/searchParams";
import { Checkbox } from "@/components/ui/checkbox";

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
          setBoundingBoxCoordinatesQP(newQP);
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
    });
    return null;
  };

  const handleCheckedChange = useCallback((newState: boolean) => {
    setSearchOnMove(newState);
  }, []);

  return (
    <div className="order-2 mb-10 h-[300px] shrink-0 overflow-hidden border md:h-[380px] lg:sticky lg:top-[150px] lg:z-20 lg:h-[calc(100vh_-_150px)] lg:w-2/5">
      <div id="search-page-map" className="relative mb-10 h-full w-full">
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
                    setBoundingBoxCoordinatesQP(maybeNewQP.current);
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

        <MapContainer
          key={`map-search`}
          ref={mapRef}
          bounds={bounds}
          boundsOptions={{ padding: [30, 30], animate: true }}
          style={{ height: "100%", width: "100%" }}
        >
          <ZoomTracker onZoomChange={setZoom} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />
          <LayerGroup>
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
          </LayerGroup>
        </MapContainer>
      </div>
    </div>
  );
}
