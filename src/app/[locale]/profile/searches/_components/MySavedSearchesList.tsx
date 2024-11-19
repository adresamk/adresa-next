import SavedSearchCard from "./SavedSearchCard";
import { SavedSearch } from "@prisma/client";
export default function MySavedSearchesList({
  savedSearches,
}: {
  savedSearches: SavedSearch[];
}) {
  if (savedSearches.length === 0) {
    return (
      <div className="text-center">
        No saved searches, you can create the by clicking on Save
        Search button on the search page to remember your search to
        come back to or if you want to get notification updates for
        new listings that fit those criteria
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {savedSearches.map((savedSearch) => (
        <SavedSearchCard
          key={savedSearch.id}
          savedSearch={savedSearch}
        />
      ))}
    </div>
  );
}
