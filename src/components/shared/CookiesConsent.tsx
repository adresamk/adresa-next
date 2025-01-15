"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function CookiesConsent() {
  const t = useTranslations("footer");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const acknowledgementGiven = localStorage.getItem("cookiesAcknowledgement");
    if (!acknowledgementGiven) {
      setTimeout(() => {
        setIsOpen(true);
      }, 5000);
    }
  }, []);

  const handleConsent = () => {
    localStorage.setItem("cookiesAcknowledgement", "true");
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="mb-4 text-center text-brand-light-blue"
        onClick={() => setIsOpen(true)}
      >
        {t("Cookies")}
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-center text-xl font-semibold">
              {t("Cookies")}
            </h2>
            <p className="mb-6 text-center">{t("CookiesDescription")}</p>
            <Button
              type="button"
              variant="outline"
              className="mx-auto block"
              onClick={handleConsent}
            >
              {t("CookiesAcknowledgement")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
