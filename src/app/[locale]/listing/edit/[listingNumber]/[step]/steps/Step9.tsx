import { useTranslations } from "next-intl";
import PublishingDetails from "./PublishingDetails";
import { Listing } from "@prisma/client";
import { Link } from "@/i18n/routing";

interface Step9Props {
  listing: Listing;
}

export default function Step9({ listing }: Step9Props) {
  const t = useTranslations();

  return (
    <div>
      <h2 className="text-lg font-semibold">
        {t("listing.new.progress.steps.publish.title")}
      </h2>
      <input type="string" className="hidden" defaultValue="9" name="step" />
      <PublishingDetails listing={listing} />
    </div>
  );
}
