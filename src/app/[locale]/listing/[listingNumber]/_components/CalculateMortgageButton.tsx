"use client";
import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";
import { useTranslations } from "next-intl";

interface CalculateMortgageButtonProps {}
export default function CalculateMortgageButton({}: CalculateMortgageButtonProps) {
  const t = useTranslations("");
  return (
    <Button
      className="flex gap-2"
      onClick={() => {
        window.location.href = "#mortgage-calculator";
      }}
    >
      <Percent className="h-6 w-6 rounded-full bg-white p-1" stroke="#0069fe" />{" "}
      {t("common.property.mortgage.calculate")}
    </Button>
  );
}
