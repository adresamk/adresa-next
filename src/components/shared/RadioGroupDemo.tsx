import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Separator } from "../ui/separator";

export function RadioGroupDemo({
  title = "Default title",
  defaultValue,
  values = [],
  onChange,
}: {
  title: string;
  defaultValue?: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-4">
      <h2 className="font-semibold mb-2">{title}</h2>
      <RadioGroup
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
