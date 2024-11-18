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
import { SerializedListing } from "@/lib/types";
import { capitalizeString } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";
import { LinkProps } from "next/link";

export default function ListingBreadcrumbs({
  listing,
}: {
  listing: SerializedListing;
}) {
  const router = useRouter();
  const currentMunicipality = capitalizeString(
    municipalitiesOptions.find(
      (m) => m.name === capitalizeString(listing.municipality ?? ""),
    )?.name ?? "",
  );
  const currentMunicipalityId =
    municipalitiesOptions.find((m) => m.name === currentMunicipality)?.id ?? "";

  const populatedPlacesOptions = getMunicipalityPlaces(currentMunicipalityId);
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
            value={currentMunicipality.toLowerCase()}
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
                  <SelectItem key={m.id} value={m.name.toLowerCase()}>
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
            value={currentMunicipality.toLowerCase()}
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
              {populatedPlacesOptions?.map((m) => {
                return (
                  <SelectItem key={m.id} value={m.name.toLowerCase()}>
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
function enemy() {
  return (
    <div className="breadcrumb--ellipsis" data-v-e12d7cfe="" data-v-534f0694="">
      <div className="breadcrumb--ellipsis-item" data-v-e12d7cfe="">
        <div className="breadcrumb" data-v-e12d7cfe="">
          <a href="/en/sale" className="breadcrumb__item" data-v-e12d7cfe="">
            Homes for sale
          </a>
        </div>
      </div>{" "}
      <div className="breadcrumb" data-v-e12d7cfe="">
        <span className="breadcrumb__separator" data-v-e12d7cfe="">
          &gt;
        </span>{" "}
        <a
          href="/en/for_sale-homes/piraeus-suburbs"
          rel=""
          className="breadcrumb__item"
          data-v-e12d7cfe=""
        >
          Piraeus suburbs
        </a>{" "}
        <span className="breadcrumb__separator" data-v-e12d7cfe="">
          &gt;
        </span>{" "}
        <a
          href="/en/for_sale-homes/koridallos"
          rel=""
          className="breadcrumb__item"
          data-v-e12d7cfe=""
        >
          Koridallos
        </a>{" "}
        <span className="breadcrumb__separator" data-v-e12d7cfe="">
          &gt;
        </span>{" "}
        <div
          className="dropdown b-dropdown breadcrumb__list is--small no--space btn-group"
          data-v-e12d7cfe=""
          id="__BVID__33"
        >
          <div
            aria-haspopup="menu"
            aria-expanded="false"
            role="button"
            aria-disabled="false"
            tabIndex={0}
            className="btn dropdown-toggle btn-transparent dropdown-toggle-no-caret"
            id="__BVID__33__BV_toggle_"
          >
            <a
              href="javascript:;"
              title="Select subarea"
              className="breadcrumb__item"
              data-v-e12d7cfe=""
            >
              <span data-v-e12d7cfe="">Eleftherias square</span>{" "}
              <svg
                width="12"
                height="7"
                xmlns="http://www.w3.org/2000/svg"
                className="icon sprite-icons"
                data-v-e12d7cfe=""
              ></svg>
            </a>
          </div>
          <ul
            role="menu"
            tabIndex={-1}
            className="dropdown-menu"
            aria-labelledby="__BVID__33__BV_toggle_"
          >
            {" "}
            <li role="presentation" data-v-e12d7cfe="">
              <a
                href="/en/for_sale-homes/schisto-korydallou-koridallos"
                role="menuitem"
                target="_self"
                className="dropdown-item"
              >
                Schisto Korydallou
              </a>
            </li>
            <li role="presentation" data-v-e12d7cfe="">
              <a
                href="/en/for_sale-homes/ano-korydallos-koridallos"
                role="menuitem"
                target="_self"
                className="dropdown-item"
              >
                Ano Korydallos
              </a>
            </li>
            <li role="presentation" data-v-e12d7cfe="">
              <a
                href="/en/for_sale-homes/orio-agias-varvaras-koridallos"
                role="menuitem"
                target="_self"
                className="dropdown-item"
              >
                Orio Agias Varvaras
              </a>
            </li>
            <li role="presentation" data-v-e12d7cfe="">
              <a
                href="/en/for_sale-homes/eleftherias-square-koridallos"
                role="menuitem"
                target="_self"
                className="dropdown-item"
              >
                Eleftherias square
              </a>
            </li>
            <li role="presentation" data-v-e12d7cfe="">
              <a
                href="/en/for_sale-homes/memou-square-koridallos"
                role="menuitem"
                target="_self"
                className="dropdown-item"
              >
                Memou square
              </a>
            </li>
            <li role="presentation" data-v-e12d7cfe="">
              <a
                href="/en/for_sale-homes/karava-koridallos"
                role="menuitem"
                target="_self"
                className="dropdown-item"
              >
                Karava
              </a>
            </li>
            <li role="presentation" data-v-e12d7cfe="">
              <a
                href="/en/for_sale-homes/filakes-athlitiko-kentro-koridallos"
                role="menuitem"
                target="_self"
                className="dropdown-item"
              >
                Filakes - Athlitiko Kentro
              </a>
            </li>
          </ul>
        </div>{" "}
        <span className="breadcrumb__separator" data-v-e12d7cfe="">
          &gt;
        </span>{" "}
        <span className="breadcrumb__item" data-v-e12d7cfe="">
          Listing 15670673
        </span>
      </div>
    </div>
  );
}
