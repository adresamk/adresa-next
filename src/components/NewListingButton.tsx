import { Button } from "./ui/button";
import { HousePlus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getCurrentSession } from "@/lib/sessions";
import { getTranslations } from "next-intl/server";

interface NewListingButtonProps {}

export default async function NewListingButton({}: NewListingButtonProps) {
  const t = await getTranslations();
  const { account } = await getCurrentSession();
  return (
    <>
      <Link
        target={account ? "_blank" : undefined}
        href={account ? "/listing/new" : "/signin"}
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
