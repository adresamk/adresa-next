import { Button } from "@/components/ui/button";
import { HousePlus } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface HireAgencyBannerProps {}
export default async function HireAgencyBanner({}: HireAgencyBannerProps) {
  const t = await getTranslations();
  return (
    <div className="flex h-[220px] items-center justify-between overflow-x-auto rounded-lg bg-white p-8 shadow">
      <div>
        <h3 className="text-2xl font-semibold">
          {t("user.profile.savedSearches.hireAgencies")}
        </h3>
        <p>{t("user.profile.savedSearches.hireAgenciesDescription")}</p>
        <Button className="mt-3 uppercase">
          <HousePlus className="mr-2" />{" "}
          {t("user.profile.savedSearches.hireAgencies")}
        </Button>
      </div>
      <div>
        <img src="/assets/saved-listings-bg1.png" alt="Image" />
      </div>
    </div>
  );
}
