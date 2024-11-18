import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface ToggleGroupDemoProps {
  type: "multiple" | "single";
  options: { label: string | React.ReactNode; value: string }[];
  onValueChange: (value: any) => void;
  value: string | string[];
}
export function ToggleGroupDemo({
  type = "single",
  options,
  onValueChange,
  value,
}: ToggleGroupDemoProps) {
  const isMultiple = type === "multiple";

  return (
    // @ts-ignore
    <ToggleGroup
      type={isMultiple ? "multiple" : "single"}
      className={cn(
        "flex flex-wrap justify-start gap-0",
        isMultiple ? "gap-2" : "",
      )}
      value={value}
      onValueChange={(values: any) => {
        console.log(values);
        onValueChange(values);
      }}
    >
      {options.map((option) => (
        <ToggleGroupItem
          className={cn(
            `flex items-center rounded-none border border-r-0 first:rounded-l last:rounded-r last:border-r hover:bg-blue-100 data-[state=on]:bg-brand-light-blue data-[state=off]:text-gray-500 data-[state=on]:text-white`,
            isMultiple && "rounded border",
          )}
          key={option.value}
          value={option.value}
          area-label={"Toggle " + option.value}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
