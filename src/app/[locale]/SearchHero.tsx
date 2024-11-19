import InitialFilters from "@/components/shared/filters/InitialFilters";

export default function SearchHero() {
  return (
    <div className="flex h-[450px] w-full items-center bg-red-50 bg-search-filter">
      <InitialFilters />
    </div>
  );
}
