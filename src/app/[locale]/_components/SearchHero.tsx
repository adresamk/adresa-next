import InitialFilters from "@/components/shared/filters/InitialFilters";
import { getTranslations } from "next-intl/server";

export default async function SearchHero() {
  const t = await getTranslations();
  return (
    <div className="flex h-[480px] w-full flex-col items-center justify-center bg-search-filter">
      <h1 className="mb-8 text-center text-4xl font-bold text-white">
        {t("home.search.title")}
      </h1>
      <InitialFilters />
    </div>
  );
}
