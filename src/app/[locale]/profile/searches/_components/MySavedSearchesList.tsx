import SavedSearchCard from "./SavedSearchCard";
import { SavedSearch } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export default async function MySavedSearchesList({
  savedSearches,
}: {
  savedSearches: SavedSearch[];
}) {
  const t = await getTranslations();
  if (savedSearches.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-brand-black-muted">
        {t("user.profile.savedSearches.noSavedSearches")}
      </div>
    );
  }
  return (
    <div
      // className=" grid max-w-5xl grid-cols-[repeat(auto-fill,minmax(229px,328px))] justify-center gap-4 overflow-x-auto sm:justify-start"
      className="flex flex-wrap justify-center gap-3 md:justify-start"
    >
      {savedSearches.map((savedSearch) => (
        <SavedSearchCard key={savedSearch.id} savedSearch={savedSearch} />
      ))}
    </div>
  );
}
