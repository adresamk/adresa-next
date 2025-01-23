"use client";
import { SelectDemo } from "@/components/shared/SelectDemo";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, BellOffIcon, LinkIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Listing, SavedSearch } from "@prisma/client";
import { parseQueryString } from "@/lib/utils";
import {
  deleteSavedSearch,
  updateSavedSearch,
} from "@/server/actions/savedSearche.actions";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const notificationIntervalOptions = ["daily", "weekly", "live"];
export default function SavedSearchCard({
  savedSearch,
}: {
  savedSearch: SavedSearch;
}) {
  const [notificationInterval, setNotificationInterval] = useState(
    savedSearch.notificationInterval,
  );
  const [isNotificationOn, setIsNotificationOn] = useState(
    savedSearch.isNotificationOn,
  );
  const router = useRouter();
  const t = useTranslations();

  const [listingsCount, setListingsCount] = useState<number | null>(null);
  const [newListingsCount, setNewListingsCount] = useState<number | null>(null);

  useEffect(() => {
    if (savedSearch.searchParams) {
      const fetchListings = async () => {
        const resp = await fetch(
          `/api/listing/getBySearchParams?path=${savedSearch.searchParams}`,
        );
        const data = await resp.json();
        console.log("data", data);
        setListingsCount(data.listings.length);
        const newListingsCount = data.listings.filter(
          (listing: Listing) =>
            new Date(listing.createdAt) > new Date(savedSearch.lastOpenedAt),
        ).length;
        setNewListingsCount(newListingsCount);
      };
      fetchListings();
    }
  }, [savedSearch.lastOpenedAt, savedSearch.searchParams]);

  const notificationIntervalOptionsTranslated = notificationIntervalOptions.map(
    (option) => {
      return {
        value: option,
        label: t(`savedSearches.notificationInterval.${option}`),
      };
    },
  );
  return (
    <div
      id={"ss" + savedSearch.id}
      className="w-[280px] rounded-md border p-3 shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {/* {searchParamsExtracted} */}
          <div className="text-lg font-semibold">
            <h4>
              <div
                // target="_blank"
                // href={"/search?" + savedSearch.searchParams}
                className="text-brand-dark-blue hover:text-brand-light-blue"
              >
                <span
                  className="flex cursor-pointer items-center"
                  onClick={async (e) => {
                    console.log("here");
                    const resp = await updateSavedSearch(
                      savedSearch.id,
                      "lastOpenedAt",
                      null,
                    );
                    if (resp.success) {
                      // or change this to click a hidden link element
                      router.push(savedSearch.searchParams);
                    }
                  }}
                >
                  <LinkIcon className="mr-2 h-5 w-5" /> {savedSearch.name}
                </span>
              </div>
            </h4>
            Search params here
            {/* <span className="capitalize">{savedSearch.type}</span>
            &apos;s for
            <span className="capitalize">
              {savedSearch.transactionType}
            </span>
            ing in {savedSearch.location},{savedSearch.municipality} */}
          </div>
        </div>
        <div>
          <Button
            variant={"outline"}
            className="h-10 w-10 rounded-full p-2"
            onClick={async () => {
              const resp = await deleteSavedSearch(savedSearch.id);
              if (resp.success) {
                // console.log("Deleted");
                const cardNode = document.getElementById("ss" + savedSearch.id);
                if (cardNode) {
                  cardNode.remove();
                }
                // revalidatePath("/profile/searches");
              }
            }}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
      <div className="my-4 flex h-4 gap-1.5 text-sm">
        {listingsCount !== null && (
          <span>
            {listingsCount}{" "}
            {listingsCount > 0
              ? "listings"
              : listingsCount === 0
                ? "no listings"
                : "listing"}
          </span>
        )}
        {newListingsCount !== null && (
          <span className="text-brand-light-blue">
            {newListingsCount > 0 ? `+${newListingsCount} new` : "0 new"}
          </span>
        )}
      </div>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={savedSearch.img || "/assets/saved-search-map-area.png"}
          width={250}
          height={88}
          alt="saved search map area"
        />
      </div>

      <div>
        <p className="mb-2.5 mt-5">
          <Button
            variant={"ghost"}
            className="flex gap-2"
            onClick={async () => {
              const resp = await updateSavedSearch(
                savedSearch.id,
                "isNotificationOn",
                !savedSearch.isNotificationOn,
              );
              if (resp.success) {
                setIsNotificationOn(!isNotificationOn);
              }
            }}
          >
            {isNotificationOn ? <Bell /> : <BellOff />}
            {isNotificationOn
              ? t("savedSearches.notificationsOn")
              : t("savedSearches.notificationsOff")}
          </Button>
        </p>
        <SelectDemo
          disabled={!isNotificationOn}
          placeholder={
            isNotificationOn ? "Select Notification Interval" : "Off"
          }
          name="notificationInterval"
          options={notificationIntervalOptionsTranslated}
          value={notificationInterval}
          onClick={async (value) => {
            const resp = await updateSavedSearch(
              savedSearch.id,
              "notificationInterval",
              value,
            );
            if (resp.success) {
              setNotificationInterval(value);
            }
          }}
        />
      </div>
    </div>
  );
}
