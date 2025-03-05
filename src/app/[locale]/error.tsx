"use client";

import { useEffect } from "react";
import { WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("");
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  // Check if it's a Prisma connection error
  const isPrismaConnectionError = error.message.includes(
    "Can't reach database server",
  );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-4 rounded-lg bg-white p-6 text-center shadow-xl">
        <WifiOff className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h2 className="mb-2 text-xl font-semibold">
          {isPrismaConnectionError
            ? t("listing.errors.connectionError")
            : t("listing.errors.somethingWentWrong")}
        </h2>
        <p className="mb-4 text-gray-600">
          {isPrismaConnectionError
            ? t("listing.errors.checkInternetTryAgain")
            : t("listing.errors.unexpectedError")}
        </p>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {t("common.actions.reloadPage")}
          </button>
          <button
            onClick={() => reset()}
            className="rounded border border-blue-500 px-4 py-2 text-blue-500 hover:bg-blue-50"
          >
            {t("common.actions.tryAgain")}
          </button>
        </div>
      </div>
    </div>
  );
}
