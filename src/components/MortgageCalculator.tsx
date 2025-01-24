"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { useTranslations } from "next-intl";

interface MortgageCalculatorProps {
  initialPrice: number;
}

export function MortgageCalculator({ initialPrice }: MortgageCalculatorProps) {
  const t = useTranslations("mortgageCalculator");
  const [homePrice, setHomePrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [interestRate, setInterestRate] = useState(3.12);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
  const loanAmount = homePrice - downPaymentAmount;

  useEffect(() => {
    // Calculate monthly payment using the formula: M = P[r(1+r)^n]/[(1+r)^n-1]
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment =
      (loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    setMonthlyPayment(isNaN(monthlyPayment) ? 0 : monthlyPayment);
  }, [homePrice, downPaymentPercent, interestRate, loanTerm, loanAmount]);

  return (
    <Card className="bg-slate-50 p-6" id="mortgage-calculator">
      <h2 className="mb-6 text-2xl font-semibold">{t("title")}</h2>

      <div className="space-y-6">
        <div>
          <Label>{t("homePrice")}</Label>
          <Input
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(Number(e.target.value))}
            className="mt-2"
          />
        </div>

        <div>
          <Label>
            {t("downPayment")} ({downPaymentPercent}%)
          </Label>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={([value]) => setDownPaymentPercent(value)}
            min={5}
            max={50}
            step={1}
            className="mt-2"
            sliderClassName="bg-brand-light-blue"

            // style={{ "--accent-color": "var(--brand-light-blue)" }}
          />
          <div className="mt-1 text-sm text-gray-500">
            {t("amount")}: €{downPaymentAmount.toLocaleString()}
          </div>
        </div>

        <div>
          <Label>
            {t("interestRate")} ({interestRate}%)
          </Label>
          <Slider
            value={[interestRate]}
            onValueChange={([value]) => setInterestRate(value)}
            min={1}
            max={10}
            step={0.01}
            className="mt-2"
            sliderClassName="bg-brand-light-blue"
          />
        </div>

        <div>
          <Label>
            {t("loanTerm")} ({loanTerm} {t("years")})
          </Label>
          <Slider
            value={[loanTerm]}
            onValueChange={([value]) => setLoanTerm(value)}
            min={10}
            max={30}
            step={5}
            className="mt-2"
            sliderClassName="bg-brand-light-blue"
          />
        </div>

        <div className="mt-6 rounded-lg bg-primary/10 p-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">{t("monthlyPayment")}</div>
            <div className="text-3xl font-bold text-primary">
              €
              <span className="text-brand-dark-blue">
                {Math.round(monthlyPayment).toLocaleString()}
              </span>
              /{t("month")}
            </div>
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">
            {t("loanAmount")}: €{Math.round(loanAmount).toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  );
}
