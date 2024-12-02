import { Bed } from "lucide-react";
import { SelectDemo } from "../../SelectDemo";
import { useFilters } from "@/hooks/useFilters";
import { useTranslations } from "next-intl";
export const bedroomsNumberOptions = [
  { label: "Any", value: "any" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10+", value: "10+" },
];
export default function BedroomsFilter() {
  const t = useTranslations("");
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  const numberBedroomsOptionsTranslated = bedroomsNumberOptions.map(
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
  return (
    <div className="flex flex-col gap-2">
      <div className="flex font-semibold leading-6">
        <Bed className="mr-2" /> {t("common.filters.secondaryFilters.bedrooms")}
      </div>
      <div className="flex items-center gap-3">
        <SelectDemo
          name="floorNumberLow"
          value={filters.bedroomsNumberLow}
          placeholder={t("common.filters.secondaryFilters.from")}
          onClick={(value) => {
            updateFilters({
              bedroomsNumberLow: value === "any" ? "" : value,
            });
          }}
          options={numberBedroomsOptionsTranslated}
        />
        <span className="">-</span>
        <SelectDemo
          name="floorNumberHigh"
          value={filters.bedroomsNumberHigh}
          placeholder={t("common.filters.secondaryFilters.to")}
          onClick={(value) => {
            updateFilters({
              bedroomsNumberHigh: value === "any" ? "" : value,
            });
          }}
          options={numberBedroomsOptionsTranslated}
        />
      </div>
    </div>
  );
}
