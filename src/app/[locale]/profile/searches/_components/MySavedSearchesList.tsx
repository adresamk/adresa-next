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
    <div className="grid max-w-5xl grid-cols-[repeat(1,minmax(236px,1fr))] gap-4 md:grid-cols-[repeat(2,minmax(236px,1fr))] lg:grid-cols-[repeat(3,minmax(236px,1fr))]">
      {savedSearches.map((savedSearch) => (
        <SavedSearchCard key={savedSearch.id} savedSearch={savedSearch} />
      ))}
    </div>
  );
}
