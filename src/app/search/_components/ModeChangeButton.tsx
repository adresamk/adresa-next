"use client";
import { Button } from "@/components/ui/button";
import { Repeat } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export default function ModeChangeButton() {
  let [mode, setMode] = useQueryState(
    "mode",
    parseAsString.withOptions({ shallow: false }).withDefault("sale")
  );
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="border-brand-light-blue text-brand-light-blue hover:text-brand-dark-blue p-2"
      onClick={() => {
        setMode(mode === "sale" ? "rent" : "sale");
      }}
    >
      {" "}
      <Repeat className="mr-2" size={16} />{" "}
      <span className="text-sm capitalize">{mode}</span>
    </Button>
  );
}
