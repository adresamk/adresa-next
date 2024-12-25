import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ListingWithRelations } from "@/types/listing.types";
import { Listing } from "@prisma/client";
import { useTranslations } from "next-intl";

interface RequestProfessionalPromotionProps {
  listing: Listing;
}
export default function RequestProfessionalPromotion({
  listing,
}: RequestProfessionalPromotionProps) {
  const lwr = listing as ListingWithRelations;
  const t = useTranslations(
    "listing.new.progress.steps.publish.requestProfessionalPromotion",
  );
  return (
    <>
      <Separator className="my-3" />
      <div className="my-3 px-2">
        <h3 className="mb-3 text-lg font-semibold">{t("title")}</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            name="requestProfessionalPromotion"
            id="requestProfessionalPromotion"
            defaultChecked={!!lwr.professionalPromotion}
          />
          <Label htmlFor="requestProfessionalPromotion">{t("label")}</Label>
        </div>
        <p className="mt-2 pl-6 text-sm leading-3 text-gray-500">
          {t("description")}
        </p>
      </div>
      <Separator className="my-3" />
    </>
  );
}
