import SavedSearchCard from "./SavedSearchCard";

export default function MySavedSearchesList({
  savedSearches,
}: {
  savedSearches: any[];
}) {
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
