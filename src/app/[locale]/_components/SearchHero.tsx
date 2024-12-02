import InitialFilters from "@/components/shared/filters/InitialFilters";
import { getTranslations } from "next-intl/server";

export default async function SearchHero() {
  const t = await getTranslations();
  return (
    <div className="flex w-full flex-col items-center justify-center bg-search-filter pb-5 pt-[80px] md:h-[480px]">
      <h1 className="mb-8 px-5 text-center text-2xl font-bold text-white md:text-3xl lg:text-4xl">
        {t("home.search.title")}
      </h1>
      <InitialFilters />
    </div>
  );
}
