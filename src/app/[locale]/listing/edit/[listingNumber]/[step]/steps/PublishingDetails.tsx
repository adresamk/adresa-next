import { Listing } from "@prisma/client";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface PublishingDetailsProps {
  listing: Listing;
}
export default function PublishingDetails({ listing }: PublishingDetailsProps) {
  const t = useTranslations("listing.new.progress.steps.publish");
  const firstUpdate = useRef(true);
  //effect description
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (listing.isPublished) {
      toast.success(t("publishMessage"), {
        richColors: true,
        position: "top-right",
        style: {
          backgroundColor: "lightgreen",
          color: "black",
        },
      });
    } else {
      toast.success(t("unpublishMessage"), {
        richColors: true,
        position: "top-right",
        style: {
          backgroundColor: "lightgreen",
          color: "black",
        },
      });
    }
  }, [listing.isPublished]);
  return (
    <div className="px-2">
      <h3 className="mt-3 text-lg font-semibold">{t("subtitle")}</h3>

      <div>
        {t("listingCurrentlyIs")}{" "}
        {listing.isPublished ? t("published") : t("unpublished")}.
      </div>
      <div className="mt-3 flex items-center space-x-4">
        {!listing.isPublished && (
          <div className="flex items-center">
            <input
              type="radio"
              name="isPublished"
              id="isPublishedYes"
              value="yes"
              //   defaultChecked={!!listing.isPublished === true}
              className="mr-2"
            />
            <label htmlFor="isPublishedYes" className="cursor-pointer">
              {t("publish")} {t("withNextSave")}
            </label>
          </div>
        )}
        {listing.isPublished && (
          <div className="flex items-center">
            <input
              type="radio"
              name="isPublished"
              id="isPublishedNo"
              //   defaultChecked={!!listing.isPublished === false}
              value="no"
              className="mr-2"
            />
            <label htmlFor="isPublishedNo" className="cursor-pointer">
              {t("unpublish")} {t("withNextSave")}
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
