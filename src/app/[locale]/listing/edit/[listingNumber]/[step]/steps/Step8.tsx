import { Listing } from "@prisma/client";
import { useTranslations } from "next-intl";
import ListingPostPreview from "../_components/ListingPostPreview";
import PaymentMethod from "@/components/PaymentMethod";
import RequestProfessionalPromotion from "./RequestProfessionalPromotion";
import PublishingDetails from "./PublishingDetails";
import { Separator } from "@/components/ui/separator";

export default function Step8({ listing }: { listing: Listing }) {
  const t = useTranslations("listing.new.progress.steps.publish");
  // const { user } = ();
  return (
    <div>
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <input type="string" className="hidden" defaultValue="8" name="step" />
      <ListingPostPreview listing={listing} />
      <Separator className="my-4" />
      {listing.userId && <RequestProfessionalPromotion listing={listing} />}
      <PaymentMethod amount={2} />
      <PublishingDetails listing={listing} />

      {/* <div>date range for publishing</div>
      <div>proceed to publish</div>
      <div>payment for special features</div>
      <div>terms and conditions?</div> */}
    </div>
  );
}
