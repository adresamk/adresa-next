import ListingsList from "./ListingsList";
import { Listing } from "@prisma/client";
import TransactionTypeSwitchButton from "./TransactionTypeSwitchButton";
import SearchBreadcrumbs from "./SearchBreadcrumbs";
import Container from "@/components/shared/Container";
import { useTranslations } from "next-intl";
import CreateSavedSearch from "@/components/shared/filters/CreateSavedSearch";

export default function Listings({ listings }: { listings: Listing[] }) {
  const t = useTranslations("search.noResults");
  return (
    <div className="order-1 border px-6 lg:w-3/5">
      {listings.length > 0 && <SearchBreadcrumbs listings={listings} />}
      {listings.length > 0 && <ListingsList listings={listings} />}
      {listings.length === 0 && (
        <Container>
          <div className="my-10 flex min-h-fit flex-col items-center justify-center text-center">
            <h1 className="my-3 text-4xl font-bold">{t("title")}</h1>
            <p className="my-3 text-center text-sm text-gray-500">
              {t("description")}
            </p>
          </div>

          <div className="flex justify-center">
            <CreateSavedSearch />
          </div>
        </Container>
      )}
    </div>
  );
}
