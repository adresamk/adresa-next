"use client";
import { Button } from "./ui/button";
import { HousePlus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { isLoggedInClient } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface NewListingButtonProps {
  isAuthenticated: boolean;
}

export default function NewListingButton({
  isAuthenticated,
}: NewListingButtonProps) {
  const t = useTranslations();
  // const { account } = await getCurrentSession();
  // const account = isLoggedInClient();
  return (
    <>
      <Link
        // target={account ? "_blank" : undefined}
        href={isAuthenticated ? "/listing/new" : "/signin"}
        // href="/listing/new"
        prefetch={true}
      >
        <Button size="sm" className="flex items-center gap-1.5 px-2.5">
          <HousePlus className="h-5 w-4 md:h-6 md:w-6" />{" "}
          <span className="hidden font-bold uppercase tracking-wide md:inline-block">
            {t("header.createListing")}
          </span>
        </Button>
      </Link>
    </>
  );
}
