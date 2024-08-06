import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Separator } from "../ui/separator";

export function RadioGroupDemo({
  title = "Default title",
  values = [],
  onChange,
}: {
  title: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-4 px-2">
      <h2 className="font-semibold">{title}</h2>
      <Separator className="my-2" />
      <RadioGroup
        defaultValue="comfortable"
        onClick={(e) => {
          const target = e.target as HTMLInputElement;
          onChange(target.value);
        }}
      >
        {values.map((value) => (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value}>{value}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
