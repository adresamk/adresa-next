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
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { Separator } from "@/components/ui/separator";

const notificationIntervalOptions = ["live", "daily", "weekly"];
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
    <article
      id={"ss" + savedSearch.id}
      className="relative mb-4 flex flex-col rounded-md border border-slate-200 shadow-lg"
    >
      {/* top */}
      <div className="relative mt-1.5 flex h-[73px] items-center justify-between gap-3 pl-4 pr-2">
        <div className="relative flex w-full items-center justify-between gap-4">
          <h2 className="line-clamp-3 h-full overflow-hidden text-base font-semibold leading-5">
            {savedSearch.name}
          </h2>
          <div className="ml-4 flex-shrink-0 basis-14">
            <img
              src="/assets/region-map-preview.png"
              alt="saved search map area"
              loading="eager"
              width={56}
              height={56}
              className="aspect-square max-w-full"
            />
          </div>
          <Link
            href={savedSearch.searchParams}
            target="_blank"
            className="absolute inset-0 z-20"
          />
        </div>
      </div>
      <div className="relative flex h-9 items-center px-4">
        <p className="text-sm">
          {listingsCount} {listingsCount === 0 && t("common.words.noListings")}
          {listingsCount === 1 && t("common.words.listing")}
          {listingsCount && listingsCount > 1 && t("common.words.listings")}
        </p>

        {newListingsCount !== null && (
          <Link
            href={savedSearch.searchParams + "&published=new_24h"}
            className="relative z-20 inline-flex cursor-pointer items-center gap-1 overflow-hidden rounded-sm px-3 py-2.5 text-sm font-bold text-slate-950 hover:bg-slate-50"
          >
            <span className="block h-1 w-1 rounded-full bg-brand-light-blue"></span>
            <span className="text-brand-light-blue">
              {newListingsCount} {t(`common.words.newListings`)}
            </span>
          </Link>
        )}
      </div>
      <a href=""></a>
      <Separator className="bg-slate-200" />

      <div className="ml-auto flex flex-col items-end gap-2 p-2.5">
        <p className="">
          <Button
            variant={"ghost"}
            className="flex gap-2 text-sm"
            size={"sm"}
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
            {isNotificationOn ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
            {isNotificationOn
              ? t("savedSearches.notificationsOn")
              : t("savedSearches.notificationsOff")}
          </Button>
        </p>
        <div className="flex items-center justify-between gap-2">
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
          <ConfirmDeleteButton
            onDelete={async () => {
              const resp = await deleteSavedSearch(savedSearch.id);
              if (resp.success) {
                const cardNode = document.getElementById("ss" + savedSearch.id);
                if (cardNode) {
                  cardNode.remove();
                }
              }
            }}
            icon={<Trash className="h-4 w-4 text-red-500" />}
            deleteText={t("common.actions.delete")}
          />
        </div>
      </div>
    </article>
  );
}
