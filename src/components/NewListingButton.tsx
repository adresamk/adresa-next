"use client";

import { Button } from "./ui/button";
import { HousePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { isLoggedInClient } from "@/lib/utils";
import { Link } from "@/i18n/routing";

interface NewListingButtonProps {}

export default function NewListingButton({}: NewListingButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const { withAuthCheck, AuthDialog } = useAuthGuard();
  const isLoggedIn = isLoggedInClient();
  return (
    <>
      <AuthDialog />
      {isLoggedIn ? (
        <Link target="_blank" href="/listing/new">
          <Button size="sm" className="flex items-center gap-1.5 px-2.5">
            <HousePlus className="h-5 w-4 md:h-6 md:w-6" />{" "}
            <span className="hidden font-bold uppercase tracking-wide md:inline-block">
              {t("header.createListing")}
            </span>
          </Button>
        </Link>
      ) : (
        <Button
          size="sm"
          className="flex items-center gap-1.5 px-2.5"
          onClick={() => {
            withAuthCheck(() => {
              router.push("/listing/new");
              return Promise.resolve();
            });
          }}
        >
          <HousePlus className="h-5 w-4 md:h-6 md:w-6" />{" "}
          <span className="hidden font-bold uppercase tracking-wide md:inline-block">
            {t("header.createListing")}
          </span>
        </Button>
      )}
    </>
  );
}
