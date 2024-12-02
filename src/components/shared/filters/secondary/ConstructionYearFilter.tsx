import { Clock } from "lucide-react";
import { SelectDemo } from "../../SelectDemo";
import { useFilters } from "@/hooks/useFilters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const startYear = 1900;
const currentYear = new Date().getFullYear();

// redo this to start from current year and ho lower
const constructionYearOptions = [
  { label: "Any", value: "any" },
  ...Array.from({ length: currentYear - startYear + 1 }, (_, i) => ({
    label: `${startYear + i}`,
    value: `${startYear + i}`,
  })).reverse(),
];

export default function ConstructionYearFilter() {
  const t = useTranslations("");
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);

  const constructionYearOptionsTranslatedFrom = constructionYearOptions.map(
    (option) => {
      if (!isNaN(parseInt(option.value[0]))) {
        return option;
      }
      return {
        ...option,
        label: t(`common.filters.secondaryFilters.${option.value}`),
      };
    },
  );
  const constructionYearOptionsTranslatedTo = [
    {
      label: t("common.filters.secondaryFilters.underConstruction"),
      value: "under_construction",
    },
    ...constructionYearOptionsTranslatedFrom,
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex font-semibold leading-6">
        <Clock className="mr-2" />{" "}
        {t("common.filters.secondaryFilters.yearOfConstruction")}
      </div>
      <div className="flex items-center gap-3">
        <SelectDemo
          name="constructionYear"
          value={filters.constructionYearLow}
          placeholder="From"
          onClick={(value) => {
            updateFilters({
              constructionYearLow: value === "any" ? "" : value,
            });
          }}
          options={constructionYearOptionsTranslatedFrom}
        />
        <span className="">-</span>
        <SelectDemo
          name="floorNumberHigh"
          value={filters.constructionYearHigh}
          placeholder="From"
          onClick={(value) => {
            updateFilters({
              constructionYearHigh: value === "any" ? "" : value,
            });
          }}
          options={constructionYearOptionsTranslatedTo}
        />
      </div>
      <div>
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => {
            updateFilters({
              isNewDevelopment: !filters.isNewDevelopment,
            });
          }}
          className={cn(
            "",
            filters.isNewDevelopment
              ? "bg-brand-light-blue text-white hover:bg-blue-700 hover:text-white"
              : "",
          )}
        >
          {t("common.filters.secondaryFilters.newDevelopment")}
        </Button>
      </div>
    </div>
  );
}
