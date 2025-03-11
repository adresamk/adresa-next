"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Agency, Listing, ListingStatus, User } from "@prisma/client";
import { useState } from "react";
import { Link } from "@/i18n/routing";

import { useTranslations } from "next-intl";
import MyListingCard from "./MyListingCard";

export default function MyListingsList({
  listings,
  agency,
}: {
  listings: Listing[];
  agency?: Agency;
}) {
  const [searchFilter, setSearchFilter] = useState("");
  const t = useTranslations();
  return (
    <>
      {agency && (
        <div className="my-2 flex items-center justify-between">
          <Input
            className="h-8 max-w-[300px]"
            type="search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={t("common.actions.search")}
          />
          {/* <Button
            variant={"outline"}
            className="border-brand-light-blue text-brand-light-blue hover:text-brand-dark-blue"
          >
            {" "}
            {t("agency.profile.listingsPage.uploadCsv")}
          </Button> */}
        </div>
      )}
      <div className="flex flex-col gap-5">
        {listings
          .filter((l: Listing) => {
            // some logic where we can use searchFilter
            return (
              l.mkTitle?.toLowerCase().includes(searchFilter.toLowerCase()) ||
              l.alTitle?.toLowerCase().includes(searchFilter.toLowerCase()) ||
              l.enTitle?.toLowerCase().includes(searchFilter.toLowerCase()) ||
              l.listingNumber.toString().includes(searchFilter)
            );
          })
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )

          .map((l: Listing) => {
            // check against all require fields
            return <MyListingCard listing={l} />;
          })}
        <div className="flex h-[190px] items-center justify-center gap-3 rounded-md border shadow-md">
          <Link href={"/listing/new"}>
            <Button
              size={"lg"}
              className="border border-brand-light-blue bg-white uppercase text-brand-light-blue hover:bg-slate-50 hover:text-brand-light-blue"
            >
              {t("agency.profile.listingsPage.createNewListing")}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
