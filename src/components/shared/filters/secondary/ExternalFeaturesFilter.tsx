import { useFilters } from "@/hooks/useFilters";
import { ToggleGroupDemo } from "../../ToggleGroupDemo";
import { House, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
const externalFeaturesOptions = [
  {
    label: (
      <>
        <Plus /> Parking
      </>
    ),
    value: "parking",
  },
  {
    label: (
      <>
        <Plus /> Yard
      </>
    ),
    value: "yard",
  },
  {
    label: (
      <>
        <Plus /> Pool
      </>
    ),
    value: "pool",
  },
];

export default function ExternalFeaturesFilter() {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  const t = useTranslations("");
  const externalFeaturesOptionsTranslated = externalFeaturesOptions.map(
    (option) => {
      return {
        ...option,
        label: t(`common.filters.features.${option.value}`),
      };
    },
  );
  return (
    <div className="flex flex-col gap-2">
      <div className="flex font-semibold leading-6">
        <House className="mr-2 h-4 w-4" />
        {t("common.filters.secondaryFilters.externalFeatures")}
      </div>
      <div className="flex items-center gap-3">
        <ToggleGroupDemo
          type="multiple"
          options={externalFeaturesOptionsTranslated}
          value={filters.externalFeatures}
          onValueChange={(value: string[]) => {
            updateFilters({
              externalFeatures: value,
            });
          }}
        />
      </div>
    </div>
  );
}
