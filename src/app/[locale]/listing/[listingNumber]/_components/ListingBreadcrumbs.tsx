"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getMunicipalityPlaces,
  municipalitiesOptions,
} from "@/lib/data/macedoniaOld/importantData";

import {
  getMunicipalitiesOptions,
  getMunicipalityOptionsTranslated,
  getMunicipalityPlacesTranslated,
  TranslatedOption,
} from "@/lib/data/macedonia/importantData";
import { Listing } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";
import { replaceFilterInUrl } from "@/lib/filters";
import { usePathname, useRouter } from "@/i18n/routing";

export default function ListingBreadcrumbs({ listing }: { listing: Listing }) {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { municipality, places } = getMunicipalityPlacesTranslated(
    listing.municipality,
    locale,
  );
  const currentPlace = places?.find((p) => p.value === listing.place);
  const municipalitiesOptions = getMunicipalityOptionsTranslated(locale);

  return (
    <Breadcrumb>
      <BreadcrumbList className="justify-center gap-0.5 md:gap-0.5">
        <BreadcrumbItem className="text-xs">
          {/* it is not link but it should return to homepage with sale/rent  preselected i think */}
          {/* <BreadcrumbLink href={`/search?mode=${listing.transactionType}`}> */}
          {t("search.filters.mode." + listing.transactionType)}
          {/* </BreadcrumbLink> */}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="text-xs">
          <Select
            value={listing.municipality || ""}
            onValueChange={(value) => {
              router.push(`/search/tt-${listing.transactionType}/l-${value}`);
            }}
          >
            <SelectTrigger className="h-auto border-0 p-0 text-xs hover:no-underline [&>span]:p-0">
              <SelectValue placeholder={t("search.filters.location.label")} />
            </SelectTrigger>
            <SelectContent>
              {municipalitiesOptions.map((municipality) => (
                <SelectItem key={municipality.value} value={municipality.value}>
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
                    `/search/tt-${listing.transactionType}/l-${value}`,
                  );
                }}
              >
                <SelectTrigger className="h-auto border-0 p-0 text-xs hover:no-underline [&>span]:p-0">
                  <SelectValue
                    placeholder={t("search.filters.location.label")}
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
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span className="text-xs">
            {t("listing.breadcrumbs.listing")} {listing.listingNumber}
          </span>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
