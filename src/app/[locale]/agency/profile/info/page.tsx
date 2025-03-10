import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/sessions";
import { updateAgencyInfo } from "@/server/actions/agency.actions";
import {} from "@/server/actions/user.actions";
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";
import { AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
    <div className="mt-4 rounded-lg bg-white p-8 shadow md:ml-4 md:max-w-xl">
      <h3 className="mb-3 text-2xl font-semibold">
        {t("agency.profile.info.title")}
      </h3>
      <Alert className="mb-4 mt-10 p-2 pb-1" variant={"info"}>
        <Info className="h-4 w-4" />
        <AlertDescription className="">
          {t("agency.profile.info.alertInfo")}
        </AlertDescription>
      </Alert>
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
            highlightRequired
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
            highlightRequired
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
            highlightRequired
            type="email"
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
