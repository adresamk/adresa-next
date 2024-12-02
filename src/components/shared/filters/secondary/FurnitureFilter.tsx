import { useFilters } from "@/hooks/useFilters";
import { ToggleGroupDemo } from "../../ToggleGroupDemo";
import { Armchair } from "lucide-react";
import { useTranslations } from "next-intl";

const furnitureOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];
export default function FurnitureFilter() {
  const t = useTranslations("");
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  const furnitureOptionsTranslated = furnitureOptions.map((option) => {
    return {
      ...option,
      label: t(`common.buttons.${option.value}`),
    };
  });
  return (
    <div className="flex flex-col gap-2">
      <div className="flex font-semibold leading-6">
        <Armchair className="mr-2" />
        {t("common.filters.secondaryFilters.furnitureIncluded")}
      </div>
      <div className="flex items-center gap-3">
        <ToggleGroupDemo
          type="single"
          options={furnitureOptionsTranslated}
          value={filters.isFurnitureIncluded ? "yes" : "no"}
          onValueChange={(value: string) => {
            updateFilters({
              isFurnitureIncluded: value === "yes" ? true : false,
            });
          }}
        />
      </div>
    </div>
  );
}
