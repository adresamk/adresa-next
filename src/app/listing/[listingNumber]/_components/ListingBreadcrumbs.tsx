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
} from "@/lib/data/macedonia/importantData";
import { municipalitiesWithPlaces } from "@/lib/data/macedonia/macedoniaPopulatedPlaces";
import { SerializedListing } from "@/lib/types";
import { capitalizeString } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ListingBreadcrumbs({
  listing,
}: {
  listing: SerializedListing;
}) {
  const router = useRouter();
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
        <BreadcrumbItem className="text-xs">
          <BreadcrumbLink href={`/search?mode=${listing.transactionType}`}>
            {"Home for " + listing.transactionType}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="text-xs">
          <Select
            value={currentMunicipality?.name}
            onValueChange={(value) => {
              console.log(value);
              router.push(
                `/search?mode=${listing.transactionType}&municipality=${value}`,
              );
            }}
          >
            <SelectTrigger className="h-auto border-none px-1 py-0.5 text-xs">
              <SelectValue placeholder="Municipality" />
            </SelectTrigger>
            <SelectContent>
              {municipalitiesOptions.map((m) => {
                return (
                  <SelectItem key={m.id} value={m.name}>
                    {m.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="text-xs">
          <Select
            value={currentPlace?.name}
            onValueChange={(value) => {
              console.log(value);
              router.push(
                `/search?mode=${listing.transactionType}&place=${value}`,
              );
            }}
          >
            <SelectTrigger className="h-auto border-none px-1 py-0.5 text-xs">
              <SelectValue placeholder="Municipality" />
            </SelectTrigger>
            <SelectContent>
              {populatedPlacesOptions?.map((m) => {
                return (
                  <SelectItem key={m.id} value={m.name}>
                    {m.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
