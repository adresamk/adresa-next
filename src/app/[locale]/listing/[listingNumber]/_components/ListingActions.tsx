"use client";

import LikeListingButton from "@/app/[locale]/search/_components/LikeListingButton";
import { Button } from "@/components/ui/button";
import { SerializedListing } from "@/lib/types";
import { useTranslations } from "next-intl";

import { EyeOff, Mail, NotebookText, Printer, Share2 } from "lucide-react";
import { Listing } from "@prisma/client";
import ShareListingButton from "./ShareListingButton";

export default function ListingActions({ listing }: { listing: Listing }) {
  const t = useTranslations();

  return (
    <ul className="mt-2 flex h-10 items-center gap-1 p-0 sm:gap-2.5 md:ml-auto md:mt-0">
      {false && (
        <li>
          <Button
            disabled
            size={"icon"}
            title={t("listing.actions.print")}
            variant={"outline"}
            className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
          >
            <Printer className="h-5 w-5" />
          </Button>
        </li>
      )}
      <li>
        <ShareListingButton listing={listing} />
      </li>
      {false && (
        <li>
          <Button
            disabled
            size={"icon"}
            title={t("listing.actions.notes")}
            variant={"outline"}
            className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
          >
            <NotebookText className="h-5 w-5" />
          </Button>
        </li>
      )}
      {false && (
        <li>
          <Button
            disabled
            size={"icon"}
            title={t("listing.actions.hide")}
            variant={"outline"}
            className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
          >
            <EyeOff className="h-5 w-5" />
          </Button>
        </li>
      )}
      <li>
        <Button
          onClick={() => {
            const miniContactForm =
              document.getElementById("mini-contact-form");
            const headerOffset = 100;
            const elementPosition =
              miniContactForm?.getBoundingClientRect().top!;
            const offsetPosition =
              elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }}
          size={"icon"}
          title={t("listing.actions.contact")}
          variant={"outline"}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        >
          <Mail className="h-5 w-5" />
        </Button>
      </li>
      <li>
        <LikeListingButton
          listingId={listing.id}
          className="border border-gray-500 text-brand-light-blue hover:text-brand-dark-blue"
        />
      </li>
    </ul>
  );
}
