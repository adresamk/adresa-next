import { displayArea, displayPrice } from "@/lib/utils";
import { ListingTitles, UploadedImageData } from "@/types/listing.types";
import { Listing } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";

interface ListingPostPreviewProps {
  listing: Listing;
}
export default function ListingPostPreview({
  listing,
}: ListingPostPreviewProps) {
  const t = useTranslations("");
  const locale = useLocale();
  const mainImage = listing.mainImage as UploadedImageData;

  return (
    <div className="mt-4">
      <h2>{t("listing.new.progress.steps.publish.details")}</h2>
      <div className="flex flex-col lg:flex-row">
        <div className="flex gap-4 pr-2">
          <div className="w-[110px] flex-none">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainImage?.url || "/assets/missing-image2.jpg"}
                className="rounded-md object-cover"
                alt={`${t(`common.filters.subType.${listing.type}`)}, ${t(`common.filters.mode.${listing.transactionType}`)}, ${displayArea(listing.area)}`}
                width="110"
                height="80"
              />
              <figcaption aria-hidden="true" className="sr-only">
                {listing.type}, {listing.transactionType},{" "}
                {displayArea(listing.area)}
              </figcaption>
            </figure>
          </div>
          <div className="flex-grow pb-4 font-semibold">
            <h4>
              {t(`common.filters.subType.${listing.type}`)},{" "}
              {t(`common.filters.mode.${listing.transactionType}`)},{" "}
              {displayArea(listing.area)}
            </h4>
            <p className="text-sm"> {displayPrice(listing.price)}</p>
          </div>
        </div>
        <div className="mt-4 lg:mt-0">
          {/* ts-ignore */}
          <h5>{listing[`${locale}Title` as keyof ListingTitles] || ""}</h5>
          <div>
            <p className="mb-2">
              {t("listing.new.progress.steps.publish.listingId")}
            </p>
            <p className="font-semibold">{listing.listingNumber}</p>
          </div>
          <div className="mb-3">
            <p className="mb-2">
              {t("listing.new.progress.steps.publish.publishDuration")}
            </p>
            <p className="font-semibold">
              {new Date().toLocaleDateString()} -{" "}
              {new Date(
                new Date().setMonth(new Date().getMonth() + 6),
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
