"use client";
import { SelectDemo } from "@/components/shared/SelectDemo";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, BellOffIcon, Trash } from "lucide-react";
import { useState } from "react";

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
// {
//     transactionType: "rent",
//     type: "apartment",
//     location: "Lekki",
//     manucipality: "Lagos",
//     listingsCount: 10,
//     newListingsCount: 5,
//     img: "/assets/saved-search-map-polygon.png",
//     isNotificationOn: true,
//     notificationInterval: "daily",
//   }

export default function SavedSearchCard({
  savedSearch,
}: {
  savedSearch: any;
}) {
  const [notificationInterval, setNotificationInterval] = useState(
    savedSearch.notificationInterval
  );
  return (
    <div className="rounded-md border shadow-md w-[280px] p-3">
      <div className="flex justify-between gap-3 items-start">
        <div>
          <div className="text-lg font-semibold">
            <span className="capitalize">{savedSearch.type}</span>
            &apos;s for
            <span className="capitalize">
              {savedSearch.transactionType}
            </span>
            ing in {savedSearch.location},{savedSearch.manucipality}
          </div>
        </div>
        <div>
          <Button
            variant={"outline"}
            className="rounded-full p-2 w-10 h-10"
          >
            <Trash className="text-red-500 w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-1.5 my-4 text-sm">
        <span>{savedSearch.listingsCount} listings</span>
        <span className="text-brand-light-blue">
          +{savedSearch.newListingsCount} new
        </span>
      </div>
      <div>
        <img
          src={savedSearch.img}
          width={250}
          height={88}
          alt="saved search map area"
        />
      </div>

      <div>
        <p className="mb-2.5 mt-5">
          <Button variant={"ghost"} className="flex gap-2">
            {savedSearch.isNotificationOn ? <Bell /> : <BellOff />}
            Notifications
          </Button>
        </p>
        <SelectDemo
          placeholder={
            savedSearch.isNotificationOn
              ? "Select Notification Interval"
              : "Off"
          }
          name="notificationInterval"
          options={notificationIntervalOptions}
          value={notificationInterval}
          onClick={(value) => {
            setNotificationInterval(value);
          }}
        />
      </div>
    </div>
  );
}
