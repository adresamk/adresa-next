"use client";

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
import { User } from "@prisma/client";
import { Check, Info, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface UserContactInfoProps {
  user: User;
}
export default function UserContactInfo({ user }: UserContactInfoProps) {
  const t = useTranslations("");
  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="7" name="step" />

      <h2 className="text-lg">{t("user.profile.contactInfo.title")}</h2>
      <p className="text-sm text-slate-500">
        {t("listing.new.progress.steps.contact.justVisual")}
      </p>
      <Link target="_blank" href={"/profile/contact"} className="w-full">
        <Button type="button" variant="default" size={"sm"} className="mt-1.5">
          {t("listing.new.progress.steps.contact.updateInfo")}
        </Button>
      </Link>
      <Separator className="my-2 mt-4" />

      <div className="mb-2 flex flex-col gap-3">
        <Label htmlFor="contactName">
          {t("user.profile.contactInfo.contactName")}{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          required
          disabled
          id="contactName"
          name="contactName"
          defaultValue={user.contactName ?? ""}
          placeholder={t("user.profile.contactInfo.contactNamePlaceholder")}
        />
      </div>

      <div className="mb-2 flex flex-col gap-3">
        <Label htmlFor="contactPhone">
          {t("user.profile.contactInfo.contactPhone")}{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          disabled
          required
          id="contactPhone"
          name="contactPhone"
          defaultValue={user.contactPhone ?? ""}
          placeholder={t("user.profile.contactInfo.contactPhonePlaceholder")}
        />
        {user.contactPhoneVerified && user.contactPhone ? (
          <div className="flex items-center gap-3 rounded bg-green-300 p-1.5">
            <Check className="h-4 w-4" />
            <span className="text-sm">
              {t("user.profile.contactInfo.contactPhoneVerified")}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded bg-red-300 p-1.5">
            <X className="h-4 w-4" />
            <span className="text-sm">
              {t("user.profile.contactInfo.contactPhoneNotVerified")}
            </span>
          </div>
        )}
      </div>

      <div className="mb-2 flex flex-col gap-3">
        <Label htmlFor="contactEmail">
          {t("user.profile.contactInfo.contactEmail")}{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          disabled
          required
          type="tel"
          id="contactEmail"
          name="contactEmail"
          defaultValue={user.contactEmail ?? ""}
          placeholder={t("user.profile.contactInfo.contactEmailPlaceholder")}
        />
        {user.contactEmailVerified && user.contactEmail ? (
          <div className="flex items-center gap-3 rounded bg-green-300 p-1.5">
            <Check className="h-4 w-4" />
            <span className="text-sm">
              {t("user.profile.contactInfo.contactEmailVerified")}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded bg-red-300 p-1.5">
            <X className="h-4 w-4" />
            <span className="text-sm">
              {t("user.profile.contactInfo.contactEmailNotVerified")}
            </span>
          </div>
        )}

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
        <Label htmlFor="contactHours">
          {t("user.profile.contactInfo.contactHours")}
        </Label>
        <Textarea
          disabled
          id="contactHours"
          name="contactHours"
          defaultValue={user.contactHours ?? ""}
          placeholder={t("user.profile.contactInfo.contactHoursPlaceholder")}
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
