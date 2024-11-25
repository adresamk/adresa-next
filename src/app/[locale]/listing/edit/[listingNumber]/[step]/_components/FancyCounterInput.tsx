import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useState } from "react";

interface LabelRules {
  [key: string]: string;
}
interface FancyCounterInputProps {
  name: string;
  id: string;
  min: number;
  max: number;
  startingValue: number;
  labelRules: LabelRules;
}
// {
//   "0": "Nema Spalna",
//   "1": "$ Soba",
//   "2-max": "$ Spalni",
// }
function parseLabelRules(
  rules: LabelRules,
  counter: number,
  min: number,
  max: number,
) {
  let output = " ";

  for (const [conditions, message] of Object.entries(rules)) {
    // This means it's a single number
    if (conditions.length === 1) {
      // number to react to
      const number = Number(conditions);
      if (counter === number) {
        let outputMessage = message.replace("$$", counter.toString());
        output = outputMessage;
        break;
      }
    }

    // if it's in between a range
    if (conditions.includes("-")) {
      let conditionsParsed = conditions
        .replace("min", min.toString())
        .replace("max", max.toString());
      let lr = conditionsParsed.split("-");
      let left = Number(lr[0]);
      let right = Number(lr[1]);

      if (left <= counter && counter <= right) {
        let outputMessage = message.replace("$$", counter.toString());
        output = outputMessage;
        break;
      }
    }
  }

  return output;
}
export default function FancyCounterInput({
  name,
  id,
  min,
  max,
  startingValue,
  labelRules,
}: FancyCounterInputProps) {
  const [counter, setCounter] = useState(startingValue);
  return (
    <div className="flex w-full items-center justify-center">
      <Button
        type="button"
        className=""
        onClick={() => {
          setCounter((pv) => {
            let nextValue = pv - 1;
            if (nextValue < min) {
              return pv;
            }

            return nextValue;
          });
        }}
      >
        -
      </Button>
      <Input
        type="hidden"
        name={name}
        id={id}
        value={counter}
        onChange={(e) => {
          // setCounter((pv) => pv + 1);
        }}
      />
      <div
        className={cn("w-full text-center", counter === min && "text-gray-400")}
      >
        {parseLabelRules(labelRules, counter, min, max)}
      </div>
      <Button
        type="button"
        className=""
        onClick={() => {
          setCounter((pv) => {
            let nextValue = pv + 1;
            if (nextValue > max) {
              return pv;
            }

            return nextValue;
          });
        }}
      >
        +
      </Button>
    </div>
  );
}
