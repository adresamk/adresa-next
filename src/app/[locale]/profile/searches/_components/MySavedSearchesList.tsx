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
      <div className="text-center">
        {t("user.profile.savedSearches.noSavedSearches")}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {savedSearches.map((savedSearch) => (
        <SavedSearchCard key={savedSearch.id} savedSearch={savedSearch} />
      ))}
    </div>
  );
}
