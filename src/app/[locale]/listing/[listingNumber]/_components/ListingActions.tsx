"use client";

import LikeListingButton from "@/app/[locale]/search/_components/LikeListingButton";
import { Button } from "@/components/ui/button";
import { SerializedListing } from "@/lib/types";
import { useTranslations } from "next-intl";

import { EyeOff, Mail, NotebookText, Printer, Share2 } from "lucide-react";
import { Listing } from "@prisma/client";

export default function ListingActions({ listing }: { listing: Listing }) {
  const t = useTranslations();

  return (
    <ul className="mt-2 flex h-10 items-center gap-2.5 p-0 md:ml-auto md:mt-0">
      <li>
        <Button
          size={"icon"}
          title={t("listing.actions.print")}
          variant={"outline"}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        >
          <Printer />
        </Button>
      </li>
      <li>
        <Button
          size={"icon"}
          title={t("listing.actions.share")}
          variant={"outline"}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        >
          <Share2 />
        </Button>
      </li>
      <li>
        <Button
          size={"icon"}
          title={t("listing.actions.notes")}
          variant={"outline"}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        >
          <NotebookText />
        </Button>
      </li>
      <li>
        <Button
          size={"icon"}
          title={t("listing.actions.hide")}
          variant={"outline"}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        >
          <EyeOff />
        </Button>
      </li>
      <li>
        <Button
          size={"icon"}
          title={t("listing.actions.contact")}
          variant={"outline"}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        >
          <Mail />
        </Button>
      </li>
      <li>
        <LikeListingButton listingId={listing.id} />
      </li>
    </ul>
  );
}
