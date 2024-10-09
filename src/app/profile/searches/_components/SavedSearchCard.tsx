"use client";
import { SelectDemo } from "@/components/shared/SelectDemo";
import { Button } from "@/components/ui/button";
import {
  Bell,
  BellOff,
  BellOffIcon,
  LinkIcon,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { SavedSearch } from "@prisma/client";
import { parseQueryString } from "@/lib/utils";
import {
  deleteSavedSearch,
  updateSavedSearch,
} from "@/actions/savedSearches";
import Link from "next/link";

const notificationIntervalOptions = [
  {
    value: "daily",
    label: "Daily",
  },
  {
    value: "weekly",
    label: "Weekly",
  },
  {
    value: "live",
    label: "Live",
  },
];

export default function SavedSearchCard({
  savedSearch,
}: {
  savedSearch: SavedSearch;
}) {
  const [notificationInterval, setNotificationInterval] = useState(
    savedSearch.notificationInterval
  );
  const [isNotificationOn, setIsNotificationOn] = useState(
    savedSearch.isNotificationOn
  );
  const searchParamsExtracted = parseQueryString(
    savedSearch.searchParams
  );
  console.log(searchParamsExtracted);

  const listingsCount = 10;
  const newListingsCount = 2;
  return (
    <div
      id={"ss" + savedSearch.id}
      className="rounded-md border shadow-md w-[280px] p-3"
    >
      <div className="flex justify-between gap-3 items-start">
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
                  className="cursor-pointer flex items-center "
                  onClick={async (e) => {
                    console.log("here");
                    const resp = await updateSavedSearch(
                      savedSearch.id,
                      "lastOpenedAt",
                      null
                    );
                    if (resp.success) {
                      // or change this to click a hidden link element
                      window.open(
                        "/search?" + savedSearch.searchParams,
                        "_blank"
                      );
                    }
                  }}
                >
                  <LinkIcon className="mr-2 w-5 h-5" />{" "}
                  {savedSearch.name}
                </span>
              </div>
            </h4>
            Search params here
            {/* <span className="capitalize">{savedSearch.type}</span>
            &apos;s for
            <span className="capitalize">
              {savedSearch.transactionType}
            </span>
            ing in {savedSearch.location},{savedSearch.manucipality} */}
          </div>
        </div>
        <div>
          <Button
            variant={"outline"}
            className="rounded-full p-2 w-10 h-10"
            onClick={async () => {
              const resp = await deleteSavedSearch(savedSearch.id);
              if (resp.success) {
                // console.log("Deleted");
                const cardNode = document.getElementById(
                  "ss" + savedSearch.id
                );
                if (cardNode) {
                  cardNode.remove();
                }
                // revalidatePath("/profile/searches");
              }
            }}
          >
            <Trash className="text-red-500 w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-1.5 my-4 text-sm">
        <span>{listingsCount} listings</span>
        <span className="text-brand-light-blue">
          +{newListingsCount} new
        </span>
      </div>
      <div>
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
                !savedSearch.isNotificationOn
              );
              if (resp.success) {
                setIsNotificationOn(!isNotificationOn);
              }
            }}
          >
            {isNotificationOn ? <Bell /> : <BellOff />}
            Notifications
          </Button>
        </p>
        <SelectDemo
          placeholder={
            isNotificationOn ? "Select Notification Interval" : "Off"
          }
          name="notificationInterval"
          options={notificationIntervalOptions}
          value={notificationInterval}
          onClick={async (value) => {
            const resp = await updateSavedSearch(
              savedSearch.id,
              "notificationInterval",
              value
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
