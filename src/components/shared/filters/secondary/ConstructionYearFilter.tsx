import { ArrowsUpFromLine, Bed, Clock } from "lucide-react";
import { SelectDemo } from "../../SelectDemo";
import { useFilters } from "@/hooks/useFilters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold leading-6 flex">
        <Clock className="mr-2" /> Year of construction
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
          options={constructionYearOptions}
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
          options={[
            {
              label: "Under construction",
              value: "under_construction",
            },
            ...constructionYearOptions,
          ]}
        />
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
              : ""
          )}
        >
          New development
        </Button>
      </div>
    </div>
  );
}
