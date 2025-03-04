"use client";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useFilters } from "@/hooks/useFilters";
import { generateSearchUrl } from "@/lib/filters";
import { useEffect, useState } from "react";
import { writeToLocalStorage } from "@/lib/utils";
import { registerLastSearch } from "@/client/actions/lastSearches";
interface SearchButtonProps {
  variant: "homepage" | "search";
}
export default function SearchButton({ variant }: SearchButtonProps) {
  const [listingCount, setListingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const filters = useFilters((store) => store.filters);
  const t = useTranslations();
  const newDestination = generateSearchUrl({
    ...filters,
    location: filters.location === "" ? "10001" : filters.location,
  });

  // console.log("newDestination", newDestination);
  const router = useRouter();

  useEffect(() => {
    if (newDestination === "#") {
      return;
    }
    const fetchListingCount = async () => {
      setIsLoading(true);
      const response = await fetch(
        `/api/listing/count?path=${newDestination}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      router.prefetch(newDestination);
      const data = await response.json();
      console.log(data);
      setListingCount(data.count);
      setIsLoading(false);
    };
    fetchListingCount();
  }, [filters, newDestination, router]);
  return (
    <Link href={listingCount === 0 ? "#" : newDestination} prefetch={true}>
      <div
        onClick={() => {
          if (listingCount === 0) {
            return;
          }
          console.log({ newDestination });
          registerLastSearch(newDestination);
        }}
      >
        <Button
          size={"lg"}
          className="h-12 w-full min-w-[180px] px-2.5 py-0.5 text-sm font-bold uppercase tracking-tight"
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              {newDestination === "#"
                ? t("common.actions.search")
                : listingCount === 1
                  ? "1 " + t("search.filters.result")
                  : t("search.filters.results", { count: listingCount })}
              <Search className="ml-3 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </Link>
  );
}
