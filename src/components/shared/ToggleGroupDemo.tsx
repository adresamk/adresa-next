import { Bold, Italic, Underline } from "lucide-react";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
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
        "flex flex-wrap gap-0 justify-start",
        isMultiple ? "gap-2" : ""
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
            `flex items-center border rounded-none border-r-0 last:border-r first:rounded-l last:rounded-r hover:bg-blue-100
            data-[state=on]:bg-brand-light-blue data-[state=on]:text-white  data-[state=off]:text-gray-500
            `,
            isMultiple && "border rounded"
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
