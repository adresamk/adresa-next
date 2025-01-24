"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateCompanySlug } from "@/lib/utils";
import { Agency } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface NameAndSlugInputsProps {
  agency: Agency;
}
export default function NameAndSlugInputs({ agency }: NameAndSlugInputsProps) {
  const [name, setName] = useState(agency?.name || "");
  const [slug, setSlug] = useState(agency?.slug || "");
  const t = useTranslations();
  return (
    <>
      {/* Agency Name */}
      <div className="mb-2 flex flex-col gap-3">
        <Label htmlFor="name">
          {t("agency.profile.details.agencyName")}{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          required
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSlug(generateCompanySlug(e.target.value));
          }}
          name="name"
          placeholder={t("agency.profile.details.agencyNamePlaceholder")}
        />
      </div>

      {/* Agency Slug */}
      <div className="mb-2 flex flex-col gap-3">
        <Label htmlFor="slug">{t("agency.profile.details.agencySlug")} </Label>
        <span className="text-xs text-slate-500">
          {t("agency.profile.details.agencySlugInfo")}
        </span>
        <Input
          className="invalid:border-red-500"
          required
          id="slug"
          value={slug}
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          name="slug"
          placeholder={t("agency.profile.details.agencySlugPlaceholder")}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
    </>
  );
}
