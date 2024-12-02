"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RealEstateSearch } from "@/lib/types";
import { Bell, CheckCircle2Icon, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import CustomFigure from "./CustomFIgure";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function LastSearchCard({
  search,
}: {
  search: RealEstateSearch;
}) {
  const t = useTranslations();

  // These will be fetched from API db
  const totalCount = 100;
  const newPropertiesCount = 10;
  const isSaved = false;
  return (
    <Card className="relative flex h-full max-h-[362px] w-[240px] max-w-[318px] flex-col hover:shadow-lg md:min-w-[310px]">
      <Link
        target="_blank"
        // TODO: Add link to search page
        href={"https://www.google.com"}
        className="absolute inset-0 z-20"
      >
        {" "}
      </Link>
      <CardHeader className="relative p-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <CustomFigure
          baseImageName={"recent-base"}
          overlayImageName={"recent-area-overlay"}
          altText={"recent-area"}
          tags={["Sale", "Home", "Price: 300000", "fourth"]}
        />
      </CardHeader>
      <CardContent className="px-4 pb-1 pt-2">
        <header className="overflow-ellipsis text-lg">
          {search.searchGeographies[0].name}
        </header>
        {search.searchGeographies.length > 1 && (
          <HoverCard openDelay={100} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="relative z-30 cursor-pointer text-lg font-bold">
                + {search.searchGeographies.length - 1}{" "}
                {search.searchGeographies.length > 2
                  ? t("savedSearches.moreLocations")
                  : t("savedSearches.location")}
              </div>
            </HoverCardTrigger>
            <HoverCardContent side="top" align="start" className="p-1.5">
              <div className="flex max-w-[220px] flex-wrap">
                {search.searchGeographies.slice(1).map((sg) => (
                  <span
                    className="m-0.5 overflow-hidden overflow-ellipsis whitespace-nowrap rounded-sm bg-gray-200 px-2 py-1 text-xs font-semibold text-slate-800 shadow-lg transition-all duration-200 ease-linear"
                    key={sg.titleName}
                  >
                    {/* Need to translate name based on language maybe, and actually remember the id of what's selected? */}

                    {sg.name}
                  </span>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </CardContent>
      <CardFooter className="mt-auto flex flex-col items-start px-4 pb-3">
        <div className="w-full pb-3 text-xs">
          <span>
            {totalCount}{" "}
            {totalCount > 1
              ? t("common.words.listings")
              : t("common.words.listing")}{" "}
          </span>
          {/* This should be a link that leads you to the search page and shows you only those 5 */}
          {/* filter with initial_publish_24h is shown, or something like also checking against date */}
          {/* After you click on this, they don't update (5 new ) doesnt go to (0 new) */}
          <span className="cursor-pointer font-semibold text-brand-light-blue">
            {"("}
            <div className="relative mx-0.5 inline-block h-2 w-1.5">
              <span className="absolute bottom-0 left-0 top-0 m-auto h-1 w-1 rounded-full bg-brand-light-blue"></span>
            </div>
            {newPropertiesCount} {t("common.search.new")}
            {")"}
          </span>
        </div>
        <Button
          variant={"ghost"}
          className="relative z-30 ml-auto flex items-center gap-1 p-0 px-0.5 hover:bg-slate-50"
        >
          {isSaved ? (
            <CheckCircle2Icon className="h-4 w-4 text-gray-500" />
          ) : (
            <Bell className="h-4 w-4 text-brand-light-blue" />
          )}
          {isSaved ? t("common.actions.saved") : t("common.actions.saveSearch")}
        </Button>
      </CardFooter>
    </Card>
  );
}
