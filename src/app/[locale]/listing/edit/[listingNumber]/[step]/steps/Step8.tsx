import { Listing } from "@prisma/client";
import { useTranslations } from "next-intl";
import ListingPostPreview from "../_components/ListingPostPreview";
import PaymentMethod from "@/components/PaymentMethod";
import RequestProfessionalPromotion from "./RequestProfessionalPromotion";

export default function Step8({ listing }: { listing: Listing }) {
  const t = useTranslations("listing.new.progress.steps.publish");
  return (
    <div>
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <input type="string" className="hidden" defaultValue="8" name="step" />
      <ListingPostPreview listing={listing} />
      <RequestProfessionalPromotion listing={listing} />
      <PaymentMethod amount={400} />
      <h3 className="mt-3 text-lg font-semibold">{t("subtitle")}</h3>
      <div className="mt-3 flex items-center space-x-4">
        <div className="flex items-center">
          <input
            type="radio"
            name="isPublished"
            id="isPublishedYes"
            value="yes"
            defaultChecked={!!listing.isPublished === true}
            className="mr-2"
          />
          <label htmlFor="isPublishedYes" className="cursor-pointer">
            {t("publish")}
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            name="isPublished"
            id="isPublishedNo"
            defaultChecked={!!listing.isPublished === false}
            value="no"
            className="mr-2"
          />
          <label htmlFor="isPublishedNo" className="cursor-pointer">
            {t("unpublish")}
          </label>
        </div>
      </div>
      {/* <div>date range for publishing</div>
      <div>proceed to publish</div>
      <div>payment for special features</div>
      <div>terms and conditions?</div> */}
    </div>
  );
}
