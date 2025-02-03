"use client";
import { Button } from "@/components/ui/button";
import { Repeat } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { extractFromUrl, replaceFilterInUrl } from "@/lib/filters";
import { PropertyTransactionType } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TransactionTypeSwitchButton() {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  let [transactionType, setTransactionType] = useState<PropertyTransactionType>(
    // TODO: This doesn't set the default value correctly
    () =>
      extractFromUrl(pathname, "transactionType") as PropertyTransactionType,
  );
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="border-brand-light-blue p-2 text-brand-light-blue hover:text-brand-dark-blue"
      onClick={() => {
        if (pathname) {
          const newPath = replaceFilterInUrl(
            pathname,
            "transactionType",
            transactionType === "sale" ? "rent" : "sale",
            searchParams,
          );
          // console.log("newPath", newPath);
          router.push(newPath);
        }
      }}
    >
      {" "}
      <Repeat className="mr-2" size={16} />{" "}
      <span className="text-sm capitalize">
        {t(`search.filters.mode.${transactionType}`)}
      </span>
    </Button>
  );
}
