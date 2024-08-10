import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Separator } from "../ui/separator";
import { cx } from "class-variance-authority";

export function RadioGroupDemo({
  title = "Default title",
  defaultValue,
  values = [],
  direction = "vertical",
  onChange,
}: {
  title: string;
  defaultValue?: string;
  direction: "horisontal" | "vertical";
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div
      className={cx(
        "mt-4",
        direction === "horisontal" && "flex gap-2 items-center"
      )}
    >
      <h2
        className={cx(
          "font-semibold",
          direction === "vertical" && "mb-2"
        )}
      >
        {title}
      </h2>
      <RadioGroup
        className={cx("", direction === "horisontal" && "flex gap-2")}
        defaultValue={defaultValue}
        onClick={(e) => {
          const target = e.target as HTMLInputElement;
          onChange(target.value);
        }}
      >
        {values.map((value) => (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value} className="capitalize">
              {value}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
