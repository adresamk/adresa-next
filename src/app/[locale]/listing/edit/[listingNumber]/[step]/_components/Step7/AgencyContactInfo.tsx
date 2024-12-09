"use client";
import { Agency } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/routing";
import { Check, Info, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface AgencyContactInfoProps {
  agency: Agency;
}
export default function AgencyContactInfo({ agency }: AgencyContactInfoProps) {
  const t = useTranslations("");
  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="7" name="step" />

      <h2 className="text-lg">
        {t("agency.profile.details.contactInfoTitle")}
      </h2>
      <p className="text-sm text-slate-500">
        {t("listing.new.progress.steps.contact.justVisual")}
      </p>
      <Link target="_blank" href={"/agency/profile/details"} className="w-full">
        <Button type="button" variant="default" size={"sm"} className="mt-1.5">
          {t("listing.new.progress.steps.contact.updateInfo")}
        </Button>
      </Link>
      <Separator className="my-2 mt-4" />

      <div className="mb-2 flex flex-col gap-3">
        <Label htmlFor="contactPersonFullName">
          {t("agency.profile.details.contactPersonFullName")}{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          required
          disabled
          id="contactPersonFullName"
          name="contactPersonFullName"
          defaultValue={agency.contactPersonFullName ?? ""}
          placeholder={t(
            "agency.profile.details.contactPersonFullNamePlaceholder",
          )}
        />
      </div>
      <div className="mb-2 flex flex-col gap-3">
        <Label htmlFor="contactPersonEmail">
          {t("agency.profile.details.contactPersonEmail")}{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          disabled
          required
          type="tel"
          id="contactPersonEmail"
          name="contactPersonEmail"
          defaultValue={agency.contactPersonEmail ?? ""}
          placeholder={t(
            "agency.profile.details.contactPersonEmailPlaceholder",
          )}
        />

        <div className="flex justify-between text-sm">
          <span>
            {t("listing.new.progress.steps.contact.emailInfo.notPublished")}
          </span>
          <Popover>
            <PopoverTrigger>
              <div className="cursor-pointer text-blue-400 underline">
                {t("listing.new.progress.steps.contact.emailInfo.learnMore")}
              </div>
            </PopoverTrigger>
            <PopoverContent align="start" className="max-w-[400px] p-0">
              <div className="p-4">
                <h2 className="mb-1 font-semibold">
                  {t(
                    "listing.new.progress.steps.contact.emailInfo.whyNotPublished",
                  )}
                </h2>
                <div className="text-sm">
                  {t(
                    "listing.new.progress.steps.contact.emailInfo.reasonNotPublished",
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="mb-2 flex flex-col gap-3">
        <Label htmlFor="contactPersonPhone">
          {t("agency.profile.details.contactPersonPhone")}{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          disabled
          required
          id="contactPersonPhone"
          name="contactPersonPhone"
          defaultValue={agency.contactPersonPhone ?? ""}
          placeholder={t(
            "agency.profile.details.contactPersonPhonePlaceholder",
          )}
        />
      </div>

      <div className="mb-2 flex flex-col gap-3">
        <Label htmlFor="contactHours">
          {t("agency.profile.details.contactHours")}
        </Label>
        <Textarea
          disabled
          id="contactHours"
          name="contactHours"
          defaultValue={agency.contactHours ?? ""}
          placeholder={t("agency.profile.details.contactHoursPlaceholder")}
        />
      </div>

      <div className="mb-2 flex flex-col gap-3">
        <Label htmlFor="preferredContactMethod">
          {t("agency.profile.details.contactHours")}
        </Label>
        <Input
          disabled
          id="preferredContactMethod"
          name="preferredContactMethod"
          defaultValue={agency.preferredContactMethod ?? ""}
        />
      </div>

      <div className="mb-2 flex flex-col gap-3">
        <div className="flex items-center gap-3 py-2 pr-2 text-slate-500">
          <div className="p-4">
            <Info fill="gray" color="white" />{" "}
          </div>
          <span className="text-sm">
            {t("listing.new.progress.steps.contact.securityInfo")}
          </span>
        </div>
      </div>
    </div>
  );
}
