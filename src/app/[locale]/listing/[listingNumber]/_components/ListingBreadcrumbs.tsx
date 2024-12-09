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
import { municipalitiesWithPlaces } from "@/lib/data/macedoniaOld/macedoniaPopulatedPlaces";
import { SerializedListing } from "@/lib/types";
import { capitalizeString } from "@/lib/utils";
import { Listing } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ListingBreadcrumbs({
  listing,
}: {
  listing: SerializedListing | Listing;
}) {
  const router = useRouter();
  const t = useTranslations();

  const currentMunicipality = municipalitiesOptions.find(
    (m) => m.id === listing.municipality,
  )!;

  const populatedPlacesOptions = getMunicipalityPlaces(currentMunicipality?.id);
  const currentPlace = populatedPlacesOptions?.find(
    (p) => p.id === listing.place,
  );

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-0.5 md:gap-0.5">
        {/* <BreadcrumbItem className="text-xs">
          <BreadcrumbLink href="/">
            {t("listing.breadcrumbs.home")}
          </BreadcrumbLink>
        </BreadcrumbItem> */}
        {/* <BreadcrumbSeparator /> */}
        <BreadcrumbItem className="text-xs">
          <BreadcrumbLink href={`/search?mode=${listing.transactionType}`}>
            {t("common.filters.mode." + listing.transactionType)}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="text-xs">
          <Select
            value={currentMunicipality?.id}
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
                <SelectItem key={municipality.id} value={municipality.id}>
                  {municipality.name}
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
                value={currentPlace?.id}
                onValueChange={(value) => {
                  router.push(
                    `/search?mode=${listing.transactionType}&municipality=${currentMunicipality.id}&place=${value}`,
                  );
                }}
              >
                <SelectTrigger className="h-auto border-0 p-0 text-xs hover:no-underline [&>span]:p-0">
                  <SelectValue
                    placeholder={t("common.filters.location.label")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {populatedPlacesOptions?.map((place) => (
                    <SelectItem key={place.id} value={place.id}>
                      {place.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
