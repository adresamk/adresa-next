import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cx } from "class-variance-authority";

interface RadioGroupDemoProps {
  title?: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  direction?: "horisontal" | "vertical";
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
  description?: string;
}
export function RadioGroupDemo({
  title = "Default title",
  required = false,
  name,
  defaultValue,
  options = [],
  direction = "vertical",
  onChange,
  description,
}: RadioGroupDemoProps) {
  if (options.length === 0) {
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
        required
        name={name}
        className={cx("", direction === "horisontal" && "flex gap-2")}
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className="text-brand-light-blue accent-current"
              onClick={(e) => {
                if (onChange) {
                  onChange(option.value);
                }
              }}
            />
            <Label htmlFor={option.value} className="cursor-pointer capitalize">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
