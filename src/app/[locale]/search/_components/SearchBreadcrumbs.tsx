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
import ListingBreadcrumbs from "../../listing/[listingNumber]/_components/ListingBreadcrumbs";

export default function SearchBreadcrumbs({
  listings,
}: {
  listings: Listing[];
}) {
  let [type, setType] = useQueryState(
    "type",
    parseAsString.withOptions({ shallow: false }).withDefault("Homes"),
  );

  let [location, setLocation] = useQueryState(
    "location",
    parseAsString.withOptions({ shallow: false }).withDefault("Skopje"),
  );
  if (listings) {
    return <ListingBreadcrumbs listing={listings[0]} />;
  }
  return (
    <div className="text-sm">
      <Breadcrumb>
        <BreadcrumbList className="gap-1 sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{type}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">{location}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Select Neighbourhood</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
