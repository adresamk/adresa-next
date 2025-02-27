import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/sessions";
import { updateAgencyInfo } from "@/server/actions/agency.actions";
import {} from "@/server/actions/user.actions";
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Информации",
  description: "Информации за агенција на Adresa.mk",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfileInfoPage() {
  // we always expect user because of the layout auth

  const { isAuthenticated, agency } = await getCurrentUser();
  const t = await getTranslations();
  const locale = await getLocale();
  if (isAuthenticated && !agency) {
    redirect({ href: "/agency/profile/details", locale: locale });
  }

  return (
    <div className="ml-4 mt-4 rounded-lg bg-white p-8 shadow">
      <h3 className="mb-3 text-2xl font-semibold">
        {t("agency.profile.info.title")}
      </h3>
      <form
        className="py-2"
        action={async (formData: FormData) => {
          "use server";
          const result = await updateAgencyInfo(formData);
          // Handle result.success and result.error as needed
        }}
      >
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="ownerFirstName">
            {t("agency.profile.info.ownerFirstName")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="ownerFirstName"
            defaultValue={agency?.ownerFirstName || ""}
            name="ownerFirstName"
            placeholder={t("agency.profile.info.ownerFirstName")}
          />
        </div>

        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="ownerLastName">
            {t("agency.profile.info.ownerLastName")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="ownerLastName"
            name="ownerLastName"
            defaultValue={agency?.ownerLastName || ""}
            placeholder={t("agency.profile.info.ownerLastName")}
          />
        </div>

        <h3 className="mb-3 mt-5 text-2xl font-semibold">
          {t("agency.profile.info.contactInfo")}
        </h3>

        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="ownerPhone">
            {t("agency.profile.info.ownerPhone")}{" "}
            {/* <span className="text-red-500">*</span> */}
          </Label>
          <Input
            // required
            id="ownerPhone"
            name="ownerPhone"
            defaultValue={agency?.ownerPhone || ""}
            placeholder="(389)77 777 777 "
          />
        </div>

        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="ownerEmail">
            {t("agency.profile.info.ownerEmail")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="ownerEmail"
            name="ownerEmail"
            defaultValue={agency?.ownerEmail || ""}
            placeholder={t("agency.profile.info.ownerEmail")}
          />
        </div>

        <Button>{t("common.actions.save")}</Button>
      </form>
    </div>
  );
}
