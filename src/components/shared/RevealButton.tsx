"use client";
import { Globe, Phone } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useTranslations } from 'next-intl';

interface RevealButtonProps {
  value: string;
  usecase: "website" | "phone";
  variant?: "ghost" | "outline";
}

export default function RevealButton({
  value = "Empty Value",
  usecase,
  variant = "ghost",
}: RevealButtonProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const t = useTranslations();

  return (
    <Button
      variant={variant}
      className="min-w-[160px] whitespace-nowrap"
      onClick={() => {
        setIsRevealed(true);
      }}
    >
      {!isRevealed ? (
        <>
          {usecase === "website" && (
            <>
              <Globe className="mr-2" /> {t('common.property.publisherDetails.website')}
            </>
          )}

          {usecase === "phone" && (
            <>
              <Phone className="mr-2" /> {t('common.property.publisherDetails.phone')}
            </>
          )}
        </>
      ) : (
        <>
          {usecase === "website" && (
            <>
              <a href={value} target="_blank" rel="noopener noreferrer">
                {value}
              </a>
            </>
          )}

          {usecase === "phone" && <>{value}</>}
        </>
      )}
    </Button>
  );
}
