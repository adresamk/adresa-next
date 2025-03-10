"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Agency, Listing, ListingStatus, User } from "@prisma/client";
import { checkListingCompleteness, cn, displayDate } from "@/lib/utils";
import { AlertCircle, Edit, MousePointerClick } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import ListingDeleteButton from "../listing/ListingDeleteButton";
import ListingVisibilityButton from "../listing/ListingVisibilityButton";
import { UserRoles } from "@/lib/data/user/importantData";
import {
  ListingTitles,
  ListingWithViewCount,
  UploadedImageData,
} from "@/types/listing.types";
import { useLocale, useTranslations } from "next-intl";

export default function MyListingsList({
  listings,
  agency,
}: {
  listings: Listing[];
  agency?: Agency;
}) {
  const [searchFilter, setSearchFilter] = useState("");
  const locale = useLocale();
  const t = useTranslations();
  return (
    <>
      {agency && (
        <div className="my-2 flex items-center justify-between">
          <Input
            className="max-w-[300px]"
            type="search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search"
          />
          <Button
            variant={"outline"}
            className="border-brand-light-blue text-brand-light-blue hover:text-brand-dark-blue"
          >
            {" "}
            {t("agency.profile.listingsPage.uploadCsv")}
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-5">
        {listings
          .filter((l: Listing) => {
            // some logic where we can use searchFilter
            return l;
          })
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )

          .map((l: Listing) => {
            // check against all require fields

            const listingWithViewCount = l as ListingWithViewCount;
            console.log("listingWithViewCount", listingWithViewCount);
            const listingViewCount = listingWithViewCount.viewCount?.count || 0;
            const title = l[`${locale}Title` as keyof ListingTitles] || "";
            console.log("title", title);
            const isComplete = checkListingCompleteness(l);
            const shouldBeGrayedOut =
              !isComplete || l.status === ListingStatus.INACTIVE;

            const image = l.mainImage as UploadedImageData;
            return (
              <div
                key={l.id}
                className="flex max-h-[240px] min-h-[202px] rounded-md border shadow-md"
              >
                <div className="w-4/12 min-w-[250px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image?.url || "/assets/missing-image2.jpg"}
                    alt="Property image"
                    className={cn(
                      "h-full w-full rounded-bl-md rounded-br-none rounded-tl-md rounded-tr-none bg-cover object-cover",
                      shouldBeGrayedOut && "opacity-50",
                    )}
                  />
                </div>
                <div className="flex w-8/12 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      <Link href={`/listing/${l.listingNumber}`}>
                        Listing: {l.listingNumber}
                      </Link>
                    </p>
                    <div className="flex justify-end text-xs">
                      {!l.publishedAt ? (
                        <Link
                          href={`/listing/edit/${l.listingNumber}/characteristics`}
                          prefetch
                        >
                          <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="px-2 text-xs"
                          >
                            <Edit className="mr-2" /> {t("common.actions.edit")}
                          </Button>
                        </Link>
                      ) : (
                        <ListingVisibilityButton listing={l} />
                      )}
                      <ListingDeleteButton listingId={l.id} />
                    </div>
                  </div>
                  <div>
                    <Link href={`/listing/${l.listingNumber}`}>
                      <h4 className="my-4 font-semibold">
                        {title ? (
                          <span className="capitalize">{title}</span>
                        ) : (
                          <span className="capitalize">
                            {l.type}, {l.area}
                          </span>
                        )}
                      </h4>
                    </Link>
                    <div className="text-xs">
                      <p>
                        {t("common.words.createdAt")} {displayDate(l.createdAt)}
                      </p>
                      {l.publishedAt && (
                        <p>
                          {t("common.words.publishedAt")}{" "}
                          {displayDate(l.publishedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="">
                      {!isComplete ? (
                        <div className="flex items-center gap-3">
                          <AlertCircle stroke="orange" />{" "}
                          <span>{t("listing.errors.requiredFields")}</span>
                        </div>
                      ) : (
                        <div className="flex h-9 items-center gap-3">
                          <MousePointerClick fill="blue" />{" "}
                          <div className="text-sm font-bold text-brand-light-blue">
                            <div>{listingViewCount}</div>
                            <div>views</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="min-w-[120px]">
                      {l.isPublished && (
                        <Link
                          href={`/listing/edit/${l.listingNumber}/whatever`}
                        >
                          <Button
                            variant={"outline"}
                            className={"w-full text-brand-light-blue"}
                          >
                            Edit
                          </Button>
                        </Link>
                      )}
                      {!l.isPublished && (
                        <Button className="w-full border-brand-light-blue text-white hover:text-brand-dark-blue">
                          {t("common.actions.publish")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
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
