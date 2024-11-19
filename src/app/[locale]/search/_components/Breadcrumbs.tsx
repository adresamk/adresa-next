"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { parseAsString, useQueryState } from "nuqs";

export default function Breadcrumbs() {
  let [type, setType] = useQueryState(
    "type",
    parseAsString.withOptions({ shallow: false }).withDefault("Homes")
  );

  let [location, setLocation] = useQueryState(
    "location",
    parseAsString
      .withOptions({ shallow: false })
      .withDefault("Skopje")
  );
  return (
    <div className="text-sm">
      <Breadcrumb>
        <BreadcrumbList className="gap-1 sm:gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{type}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">
              {location}
            </BreadcrumbLink>
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
