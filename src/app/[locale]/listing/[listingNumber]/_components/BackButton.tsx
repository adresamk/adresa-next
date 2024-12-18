"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function BackButton() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();
  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleBack = () => {
    if (canGoBack) {
      // Attempt to go back
      const referrer = document.referrer;
      if (referrer && referrer !== "" && referrer !== "about:blank") {
        window.history.back();
      } else {
        router.push("/search");
      }
    } else {
      window.close();
      // If window.close() doesn't work, fallback to redirect (optional)
      if (!window.closed) {
        alert("This tab cannot be closed automatically."); // Optional user feedback
      } else {
        router.push("/search"); // Redirect to a default page, e.g., '/search'
      }
    }
  };

  return (
    <Button
      onClick={handleBack}
      variant="ghost"
      className="mr-5 inline-flex items-center text-xs font-semibold"
    >
      <ArrowLeftIcon className="mr-2 h-4 w-4" />
      {t("common.buttons.back")}
    </Button>
  );
}

export default BackButton;
