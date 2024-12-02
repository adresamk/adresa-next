import { useFilters } from "@/hooks/useFilters";
import { ToggleGroupDemo } from "../../ToggleGroupDemo";
import { Calendar } from "lucide-react";
import { SelectDemo } from "../../SelectDemo";
import { useTranslations } from "next-intl";

const timeRangeOptions = [
  {
    label: "Any",
    value: "any",
  },
  {
    label: "24h",
    value: "24h",
  },
  {
    label: "3d",
    value: "3d",
  },
  {
    label: "7d",
    value: "7d",
  },
  {
    label: "30d",
    value: "30d",
  },
];

const extraTimeRangeOptions = [
  {
    label: "6 months",
    value: "6m",
  },
  {
    label: "1 year",
    value: "1y",
  },
];

export default function CreationDateFilter() {
  const t = useTranslations("");
  const filters = useFilters((store) => store.filters);
  const timeRangeOptionsTranslated = timeRangeOptions.map((option) => {
    return {
      ...option,
      label: t(`common.filters.secondaryFilters.timeRange.${option.value}`),
    };
  });
  const extraTimeRangeOptionsTranslated = extraTimeRangeOptions.map(
    (option) => {
      return {
        ...option,
        label: t(
          `common.filters.secondaryFilters.extraTimeRange.${option.value}`,
        ),
      };
    },
  );
  const updateFilters = useFilters((store) => store.updateFilters);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex font-semibold leading-6">
        <Calendar /> {t("common.filters.secondaryFilters.creationDate")}
      </div>
      <div className="flex items-center gap-3">
        <ToggleGroupDemo
          type="single"
          options={timeRangeOptionsTranslated}
          value={filters.creationDate === "" ? "any" : filters.creationDate}
          onValueChange={(value: string) => {
            updateFilters({
              creationDate: value === "any" ? "" : value,
            });
          }}
        />

        <SelectDemo
          name="lastUpdated"
          value={
            timeRangeOptions.map((o) => o.value).includes(filters.creationDate)
              ? ""
              : filters.creationDate
          }
          placeholder="Other"
          onClick={(value) => {
            updateFilters({
              creationDate: value,
            });
          }}
          options={extraTimeRangeOptionsTranslated}
        />
      </div>
    </div>
  );
}
