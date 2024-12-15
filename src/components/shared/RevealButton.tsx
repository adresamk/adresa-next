"use client";
import { Globe, Phone } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface RevealButtonProps {
  value: string | null | undefined;
  usecase: "website" | "phone";
  variant?: "ghost" | "outline";
}

export default function RevealButton({
  value,
  usecase,
  variant = "ghost",
}: RevealButtonProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const t = useTranslations();

  if (!value) return null;

  return (
    <Button
      type="button"
      variant={variant}
      className={cn("reveal-button m-0.5 whitespace-nowrap", {
        loading: isRevealed,
      })}
      onClick={() => {
        setIsRevealed(true);
      }}
    >
      <div className={`text flex items-center justify-center`}>
        {usecase === "website" && (
          <>
            <Globe className="mr-2" />
            {t("common.property.publisherDetails.website")}
          </>
        )}
        {usecase === "phone" && (
          <>
            <Phone className="mr-2" />
            {t("common.property.publisherDetails.phone")}
          </>
        )}
      </div>
      <div className={`revealed-text flex items-center justify-center`}>
        {usecase === "website" && (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        )}
        {usecase === "phone" && (
          <a href={`tel:${value}`} className="t">
            {value}
          </a>
        )}
      </div>
    </Button>
  );
}
