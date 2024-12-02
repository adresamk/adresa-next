import { Thermometer } from "lucide-react";
import { SelectDemo } from "../../SelectDemo";
import { useFilters } from "@/hooks/useFilters";
import { useTranslations } from "next-intl";

const heatingTypeOptions = [
  { label: "Any", value: "any" },
  { label: "Central", value: "central" },
  { label: "Electric", value: "electric" },
  { label: "Gas", value: "gas" },
  { label: "Geothermal", value: "geothermal" },
  { label: "Heat pump", value: "heat_pump" },
  { label: "Wood", value: "wood" },
  { label: "Solar", value: "solar" },
  { label: "Underfloor", value: "underfloor" },
  { label: "Other", value: "other" },
];
export default function HeatingTypeFilter() {
  const filters = useFilters((store) => store.filters);
  const t = useTranslations("");
  const updateFilters = useFilters((store) => store.updateFilters);
  const heatingTypeOptionsTranslated = heatingTypeOptions.map((option) => {
    return {
      ...option,
      label: t(`common.filters.secondaryFilters.${option.value}`),
    };
  });
  return (
    <div className="flex flex-col gap-2">
      <div className="flex font-semibold leading-6">
        <Thermometer className="mr-2" />{" "}
        {t("common.filters.secondaryFilters.heating")}
      </div>
      <div className="flex items-center gap-3">
        <SelectDemo
          name="heatingType"
          value={filters.heatingType}
          placeholder={t("common.filters.secondaryFilters.heatingType")}
          onClick={(value) => {
            updateFilters({
              heatingType: value === "any" ? "" : value,
            });
          }}
          options={heatingTypeOptionsTranslated}
        />
      </div>
    </div>
  );
}
