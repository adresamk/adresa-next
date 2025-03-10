import { SelectSelfContained } from "@/components/shared/SelectSelfContained";
import { SubmitButton } from "@/components/SubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/sessions";
import { updateUserContactInfo } from "@/server/actions/user.actions";
import { Info } from "lucide-react";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

type Params = Promise<Record<string, string>>;
export const metadata: Metadata = {
  title: "Контакт информации",
  description: "Контакт информации за корисничкиот профил на Adresa.mk",
};
export default async function ProfileInfoPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const params = await searchParams;
  const { isAuthenticated, user, account } = await getCurrentUser();
  const t = await getTranslations();
  const locale = await getLocale();
  if (isAuthenticated && !user) {
    redirect({ href: "/profile/info", locale: locale });
  }

  const prefferedContactMethodOptionsTranslated = [
    { label: t("agency.profile.details.email"), value: "email" },
    { label: t("agency.profile.details.phone"), value: "phone" },
    { label: t("agency.profile.details.both"), value: "both" },
  ];
  return (
    <div className="mt-4 rounded-lg bg-white p-8 shadow md:ml-4 md:max-w-lg">
      <h3 className="mb-3 text-2xl font-semibold">
        {t("user.profile.contactInfo.title")}
      </h3>
      <Alert
        className="mb-4 mt-10 border border-orange-300 bg-orange-50"
        variant="default"
      >
        <Info className="h-4 w-4" />
        <AlertDescription className="text-slate-900">
          {t("user.profile.contactInfo.info")}
        </AlertDescription>
      </Alert>
      <form
        className="py-2"
        action={async (formData: FormData) => {
          "use server";
          const result = await updateUserContactInfo(formData);
        }}
      >
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="contactName">
            {t("user.profile.contactInfo.contactName")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="contactName"
            defaultValue={user?.contactName || ""}
            name="contactName"
            placeholder={t("user.profile.contactInfo.contactNamePlaceholder")}
          />
        </div>

        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="contactPhone">
            {t("user.profile.contactInfo.contactPhone")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="contactPhone"
            name="contactPhone"
            defaultValue={user?.contactPhone || ""}
            placeholder={t("user.profile.contactInfo.contactPhonePlaceholder")}
          />
        </div>
        <div className="mb-2 flex gap-3">
          <Checkbox
            disabled={true}
            id="contactPhoneVerified"
            name="contactPhoneVerified"
            defaultChecked={user?.contactPhoneVerified ? true : false}
          />
          <Label htmlFor="contactPhoneVerified">
            {t("user.profile.contactInfo.contactPhoneVerified")}
          </Label>
        </div>

        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="contactEmail">
            {t("user.profile.contactInfo.contactEmail")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            type="email"
            id="contactEmail"
            name="contactEmail"
            defaultValue={user?.contactEmail || ""}
            placeholder={t("user.profile.contactInfo.contactEmailPlaceholder")}
          />
        </div>
        <div className="mb-2 flex gap-3">
          <Checkbox
            disabled
            id="contactEmailVerified"
            name="contactEmailVerified"
            defaultChecked={user?.contactEmailVerified ? true : false}
          />
          <Label htmlFor="contactEmailVerified">
            {t("user.profile.contactInfo.contactEmailVerified")}
          </Label>
        </div>
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="contactHours">
            {t("user.profile.contactInfo.contactHours")}{" "}
            {/* <span className="text-red-500">*</span> */}
          </Label>
          <Textarea
            // required
            id="contactHours"
            name="contactHours"
            defaultValue={user?.contactHours || ""}
            placeholder={t("user.profile.contactInfo.contactHoursPlaceholder")}
          />
        </div>
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="preferredContactMethod">
            {t("user.profile.contactInfo.preferredContactMethod")}
          </Label>
          <SelectSelfContained
            name="preferredContactMethod"
            placeholder={t(
              "user.profile.contactInfo.preferredContactMethodPlaceholder",
            )}
            value={user?.preferredContactMethod || "both"}
            options={prefferedContactMethodOptionsTranslated}
          />
        </div>
        <SubmitButton
          className="group-[.mobile]:mt-8 group-[.mobile]:w-full"
          defaultText={t("common.actions.save")}
          loadingText={t("common.actions.saving")}
        />
      </form>
    </div>
  );
}
