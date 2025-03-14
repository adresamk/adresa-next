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
      <div className="mb-3 flex flex-col gap-1">
        <Label htmlFor="name">
          {t("agency.profile.details.agencyName")}{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          required
          highlightRequired
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
      <div className="mb-3 flex flex-col gap-1">
        <Label htmlFor="slug">
          {t("agency.profile.details.agencySlug")}
          <span className="ml-1 text-red-500">*</span>
        </Label>
        <span className="text-xs text-slate-500">
          {t("agency.profile.details.agencySlugInfo")}
        </span>
        <Input
          className="invalid:border-red-500"
          required
          highlightRequired
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
