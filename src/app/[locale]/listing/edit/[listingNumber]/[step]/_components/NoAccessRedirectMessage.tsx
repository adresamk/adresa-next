"use client";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

interface NoAccessRedirectMessageProps {}
export default function NoAccessRedirectMessage({}: NoAccessRedirectMessageProps) {
  const router = useRouter();
  const t = useTranslations();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to the home page
    }, 36000); // 6000 milliseconds = 6 seconds

    return () => clearTimeout(timer); // Clear timer if component unmounts
  }, [router]);
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center bg-gray-100">
      <div className="mx-8 rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-red-500">
          {t("listing.preview.errorUnauthorized")}
        </h2>
        <p className="text-gray-700">
          {t("listing.preview.errorUnauthorizedMessage")}
          redirected shortly.
        </p>
      </div>
    </div>
  );
}
