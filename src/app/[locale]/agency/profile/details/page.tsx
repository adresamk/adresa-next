import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUser } from "@/lib/auth";
import prismadb from "@/lib/db";
import { Info } from "lucide-react";
import AgencyLogoUpload from "./_components/AgencyLogoUpload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateAgencyDetails } from "@/server/actions/agency.actions";
import { getCurrentSession, getCurrentUser } from "@/lib/sessions";
import { redirect } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { SelectDemo } from "@/components/shared/SelectDemo";
import { SelectSelfContained } from "@/components/shared/SelectSelfContained";
import { UploadedImageData } from "@/types/listing.types";

type Params = Promise<Record<string, string>>;

export default async function AgencyProfileDetailsPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const params = await searchParams;
  console.log(params);

  const { session, account } = await getCurrentSession();
  const t = await getTranslations();
  console.log("Session", session, "Account", account);

  if (!session || !account) {
    redirect({
      href: "/",
      locale: "mk",
    });
  }

  const { isAuthenticated, agency } = await getCurrentUser();

  console.log("Current User", isAuthenticated, agency);
  // First Time Here, they need to setup profile

  const prefferedContactMethodOptionsTranslated = [
    { label: t("agency.profile.details.email"), value: "email" },
    { label: t("agency.profile.details.phone"), value: "phone" },
    { label: t("agency.profile.details.both"), value: "both" },
  ];

  return (
    <div className="ml-4 mt-4 rounded-lg bg-white p-8 shadow">
      <h3 className="mb-3 text-2xl font-semibold">
        {t("agency.profile.details.title")}
      </h3>

      <Alert className="mb-4 mt-10">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-slate-900">
          {t("agency.profile.details.info")}
        </AlertDescription>
      </Alert>
      <form
        action={async (formData: FormData) => {
          "use server";
          const result = await updateAgencyDetails(formData);
          if (result && result.error) {
            // Handle error (e.g., show a notification)
          }
        }}
        className="py-2"
        // action={updateAgencyDetails}
      >
        {/* Agency Name */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="name">
            {t("agency.profile.details.agencyName")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="name"
            defaultValue={agency?.name || ""}
            name="name"
            placeholder={t("agency.profile.details.agencyNamePlaceholder")}
          />
        </div>

        {/* Agency Adress */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="address">
            {t("agency.profile.details.agencyAdress")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="address"
            defaultValue={agency?.address || ""}
            name="address"
            placeholder={t("agency.profile.details.agencyAdressPlaceholder")}
          />
        </div>

        {/* Agency Logo */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="logo">
            {t("agency.profile.details.agencyLogo")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <AgencyLogoUpload existingLogo={agency?.logo as UploadedImageData} />
          {/* <Input
            id="logo"
            required
            defaultValue={agency?.logo || ""}
            name="logo"
            placeholder="logo"
          />
           */}
        </div>

        {/* Agency Website */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="website">
            {t("agency.profile.details.agencyWebsite")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="website"
            defaultValue={agency?.website || ""}
            name="website"
            placeholder={t("agency.profile.details.agencyWebsitePlaceholder")}
          />
        </div>

        {/* Agency Phone */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="phone">
            {t("agency.profile.details.agencyPhone")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            defaultValue={agency?.phone || ""}
            name="phone"
            placeholder={t("agency.profile.details.agencyPhonePlaceholder")}
          />
        </div>

        {/* Agency Description */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="description">
            {t("agency.profile.details.agencyDescription")}
          </Label>
          <Textarea
            rows={5}
            id="description"
            defaultValue={agency?.description || ""}
            name="description"
            placeholder={t(
              "agency.profile.details.agencyDescriptionPlaceholder",
            )}
          />
        </div>

        {/* Agency Short Description */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="shortDescription">
            {t("agency.profile.details.agencyShortDescription")}
          </Label>
          <Input
            id="shortDescription"
            defaultValue={agency?.shortDescription || ""}
            name="shortDescription"
            placeholder={t(
              "agency.profile.details.agencyShortDescriptionPlaceholder",
            )}
          />
        </div>

        {/* Agency Map Coordinates*/}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="gpsLocation">
            {t("agency.profile.details.agencyMapCoordinates")}
          </Label>
          <Input
            id="gpsLocation"
            defaultValue={agency?.gpsLocation || ""}
            name="gpsLocation"
            placeholder={t("agency.profile.details.agencyMapCoordinates")}
          />
        </div>

        {/* Agency Branding */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="branding">
            {t("agency.profile.details.agencyBrandingDetails")}
          </Label>
          <Input
            id="branding"
            defaultValue={agency?.branding || ""}
            name="branding"
            placeholder={t(
              "agency.profile.details.agencyBrandingDetailsPlaceholder",
            )}
          />
        </div>

        <h3 className="my-4 text-lg font-semibold">
          {t("agency.profile.details.contactPerson")}
        </h3>
        {/* Contact Person Full Name */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="contactPersonFullName">
            {t("agency.profile.details.contactPersonFullName")}
          </Label>
          <Input
            id="contactPersonFullName"
            defaultValue={agency?.contactPersonFullName || ""}
            name="contactPersonFullName"
            placeholder={t(
              "agency.profile.details.contactPersonFullNamePlaceholder",
            )}
          />
        </div>

        {/* Contact Person Email  */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="contactPersonEmail">
            {t("agency.profile.details.contactPersonEmail")}
          </Label>
          <Input
            id="contactPersonEmail"
            defaultValue={agency?.contactPersonEmail || ""}
            name="contactPersonEmail"
            placeholder={t(
              "agency.profile.details.contactPersonEmailPlaceholder",
            )}
          />
        </div>

        {/* Contact Person Phone  */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="contactPersonPhone">
            {t("agency.profile.details.contactPersonPhone")}
          </Label>
          <Input
            id="contactPersonPhone"
            defaultValue={agency?.contactPersonPhone || ""}
            name="contactPersonPhone"
            placeholder={t(
              "agency.profile.details.contactPersonPhonePlaceholder",
            )}
          />
        </div>

        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="preferredContactMethod">
            {t("agency.profile.details.contactPersonFullName")}
          </Label>
          <SelectSelfContained
            name="preferredContactMethod"
            placeholder="Select preferred contact method"
            value={agency?.preferredContactMethod || "both"}
            options={prefferedContactMethodOptionsTranslated}
          />
        </div>
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="contactHours">
            {t("agency.profile.details.contactHours")}
          </Label>
          <Textarea
            rows={6}
            id="contactHours"
            defaultValue={
              agency?.workHours ||
              t("agency.profile.details.contactHoursPlaceholder")
            }
            name="contactHours"
          />
        </div>

        <h3 className="my-4 text-lg font-semibold">
          {t("agency.profile.details.workHours")}
        </h3>
        {/* Contact Person Full Name */}
        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="workHours">
            {t("agency.profile.details.workHours")}
          </Label>
          <Textarea
            rows={6}
            id="workHours"
            defaultValue={
              agency?.workHours ||
              t("agency.profile.details.workHoursPlaceholder")
            }
            name="workHours"
          />
        </div>

        <Button>{t("common.actions.save")}</Button>
      </form>
    </div>
  );
}
