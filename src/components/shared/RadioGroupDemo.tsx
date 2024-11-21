import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cx } from "class-variance-authority";

interface RadioGroupDemoProps {
  title: string;
  name: string;
  defaultValue?: string;
  direction?: "horisontal" | "vertical";
  values: string[];
  onChange?: (value: string) => void;
  description?: string;
}
export function RadioGroupDemo({
  title = "Default title",
  name,
  defaultValue,
  values = [],
  direction = "vertical",
  onChange,
  description,
}: RadioGroupDemoProps) {
  if (values.length === 0) {
    return null;
  }
  return (
    <div
      className={cx(
        "mt-4",
        direction === "horisontal" && "flex items-center gap-2",
      )}
    >
      <h2 className={cx("font-semibold", direction === "vertical" && "mb-2")}>
        {title}
        {description && (
          <p className="text-xs text-gray-500">
            {description}
            <span className="text-red-500">*</span>{" "}
          </p>
        )}
      </h2>
      <RadioGroup
        name={name}
        className={cx("", direction === "horisontal" && "flex gap-2")}
        defaultValue={defaultValue}
      >
        {values.map((value) => (
          <div key={value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={value}
              id={value}
              className="text-brand-light-blue accent-current"
              onClick={(e) => {
                if (onChange) {
                  onChange(value);
                }
              }}
            />
            <Label htmlFor={value} className="cursor-pointer capitalize">
              {value}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
