import { useFilters } from "@/hooks/useFilters";
import { ToggleGroupDemo } from "../../ToggleGroupDemo";
import { AirVentIcon, AlertCircle, House, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

const internalFeaturesOptions = [
  {
    label: (
      <>
        <AirVentIcon /> AC
      </>
    ),
    value: "ac",
  },
  {
    label: (
      <>
        <Plus /> Storage
      </>
    ),
    value: "storage",
  },
  {
    label: (
      <>
        <Plus /> Garage
      </>
    ),
    value: "garage",
  },
  {
    label: (
      <>
        <AlertCircle /> Alarm
      </>
    ),
    value: "alarm",
  },
  {
    label: (
      <>
        <AlertCircle /> Fancy Art
      </>
    ),
    value: "fancy_art",
  },
  {
    label: (
      <>
        <AlertCircle /> Tito furniture
      </>
    ),
    value: "tito_furniture",
  },
  {
    label: (
      <>
        <AlertCircle /> Cat
      </>
    ),
    value: "cat",
  },
];

export default function InternalFeaturesFilter() {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  const t = useTranslations("");
  const internalFeaturesOptionsTranslated = internalFeaturesOptions.map(
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
        {t("common.filters.secondaryFilters.internalFeatures")}
      </div>
      <div className="flex items-center gap-3">
        <ToggleGroupDemo
          type="multiple"
          options={internalFeaturesOptionsTranslated}
          value={filters.internalFeatures}
          onValueChange={(value: string[]) => {
            updateFilters({
              internalFeatures: value,
            });
          }}
        />
      </div>
    </div>
  );
}
