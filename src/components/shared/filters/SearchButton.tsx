"use client";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useFilters } from "@/hooks/useFilters";
import { generateSearchUrl } from "@/lib/filters";
import { useEffect, useState } from "react";
interface SearchButtonProps {
  variant: "homepage" | "search";
}
export default function SearchButton({ variant }: SearchButtonProps) {
  const [listingCount, setListingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const filters = useFilters((store) => store.filters);
  const t = useTranslations();
  const newDestination =
    filters.location === "" ? "#" : generateSearchUrl(filters);

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
      const data = await response.json();
      console.log(data);
      setListingCount(data.count);
      setIsLoading(false);
    };
    fetchListingCount();
  }, [filters, newDestination]);
  return (
    <Link href={listingCount === 0 ? "#" : newDestination}>
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
    </Link>
  );
}
