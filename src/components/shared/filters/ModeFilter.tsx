import { Button } from "@/components/ui/button";
import { useFilters } from "@/hooks/useFilters";
import { cn } from "@/lib/utils";
interface ModeFilterProps {
  variant: "homepage" | "search";
}
export default function ModeFilter({ variant }: ModeFilterProps) {
  const filters = useFilters((store) => store.filters);
  const updateFilters = useFilters((store) => store.updateFilters);

  return (
    <>
      {variant === "homepage" && (
        <div className="flex gap-3">
          <Button
            onClick={() => updateFilters({ mode: "sale" })}
            size={"sm"}
            className={cn(
              "py-0.5 px-4 h-6 font-semibold bg-white text-brand-light-blue hover:bg-slate-50 ",
              filters.mode === "sale" &&
                "bg-blue-400 text-white hover:bg-blue-500",
              filters.mode !== "sale" &&
                "border-brand-light-blue border"
            )}
          >
            Sale
          </Button>
          <Button
            onClick={() => updateFilters({ mode: "rent" })}
            size={"sm"}
            className={cn(
              "py-0.5 px-4 h-6 font-semibold bg-white text-brand-light-blue hover:bg-slate-50",
              filters.mode === "rent" &&
                "bg-blue-400 text-white hover:bg-blue-500",
              filters.mode !== "rent" &&
                "border-brand-light-blue border"
            )}
          >
            Rent
          </Button>
        </div>
      )}
    </>
  );
}
