"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Listing } from "@prisma/client";
import { parseAsString, useQueryState } from "nuqs";
import { useLocale, useTranslations } from "next-intl";
import ListingBreadcrumbs from "../../listing/[listingNumber]/_components/ListingBreadcrumbs";
import { useRouter } from "next/navigation";
import {
  getMunicipalityOptionsTranslated,
  getMunicipalityPlacesTranslated,
} from "@/lib/data/macedonia/importantData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchBreadcrumbs({
  listings,
}: {
  listings: Listing[];
}) {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { municipality, places } = getMunicipalityPlacesTranslated(
    listings[2].municipality,
    locale,
  );
  const currentPlace = places?.find((p) => p.value === listings[0].place);
  const municipalitiesOptions = getMunicipalityOptionsTranslated(locale);
  const listing = listings[0];
  return (
    <div className="text-sm">
      <Breadcrumb>
        <BreadcrumbList className="gap-1 sm:gap-1">
          <BreadcrumbItem className="text-xs">
            <BreadcrumbLink href={`/search?mode=${listing.transactionType}`}>
              {t("common.filters.mode." + listing.transactionType)}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-xs">
            <Select
              value={listing.municipality || ""}
              onValueChange={(value) => {
                router.push(
                  `/search?mode=${listing.transactionType}&municipality=${value}`,
                );
              }}
            >
              <SelectTrigger className="h-auto border-0 p-0 text-xs hover:no-underline [&>span]:p-0">
                <SelectValue placeholder={t("common.filters.location.label")} />
              </SelectTrigger>
              <SelectContent>
                {municipalitiesOptions.map((municipality) => (
                  <SelectItem
                    key={municipality.value}
                    value={municipality.value}
                  >
                    {municipality.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </BreadcrumbItem>
          {currentPlace && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-xs">
                <Select
                  value={listing.place || ""}
                  onValueChange={(value) => {
                    router.push(
                      `/search?mode=${listing.transactionType}&municipality=${listing.municipality}&place=${value}`,
                    );
                  }}
                >
                  <SelectTrigger className="h-auto border-0 p-0 text-xs hover:no-underline [&>span]:p-0">
                    <SelectValue
                      placeholder={t("common.filters.location.label")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {places.map((place) => (
                      <SelectItem key={place.value} value={place.value}>
                        {place.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
