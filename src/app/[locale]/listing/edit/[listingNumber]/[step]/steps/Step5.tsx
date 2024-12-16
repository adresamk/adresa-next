"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Listing } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export default function Step5({ listing }: { listing: Listing }) {
  const t = useTranslations("listing.new.progress.steps.description");

  const [enDescription, setEnDescription] = useState(
    listing.enDescription || "",
  );
  const [mkDescription, setMkdDescription] = useState(
    listing.mkDescription || "",
  );
  const [alDescription, setAlDescription] = useState(
    listing.alDescription || "",
  );

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="5" name="step" />

      <h2 className="text-lg">{t("title")}</h2>
      <Separator className="my-2 mt-4" />

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">{t("englishTitle")}</Label>
        <Input
          name="enTitle"
          className="pb-2"
          id="enTitle"
          defaultValue={listing.enTitle || ""}
          maxLength={112}
          placeholder={t("englishTitlePlaceholder")}
        />

        <Label htmlFor="enDescription">{t("englishDescription")}</Label>
        <Textarea
          name="enDescription"
          className="pb-2"
          rows={10}
          id="enDescription"
          value={enDescription}
          maxLength={5000}
          placeholder={t("englishDescriptionPlaceholder")}
          onChange={(e) => setEnDescription(e.target.value)}
        />
        <div className="mt-1 text-sm text-slate-400">
          {enDescription.length}/5000 {t("characters")}
        </div>
        <Separator className="my-2 mt-4" />
        <Label htmlFor="mkTitle">{t("macedonianTitle")}</Label>
        <Input
          name="mkTitle"
          className="pb-2"
          id="mkTitle"
          defaultValue={listing.mkTitle || ""}
          maxLength={112}
          placeholder={t("macedonianTitlePlaceholder")}
        />

        <Label htmlFor="mkDescription">{t("macedonianDescription")}</Label>
        <Textarea
          name="mkDescription"
          className="pb-2"
          rows={10}
          id="mkDescription"
          value={mkDescription}
          maxLength={5000}
          placeholder={t("macedonianDescriptionPlaceholder")}
          onChange={(e) => setMkdDescription(e.target.value)}
        />
        <div className="mt-1 text-sm text-slate-400">
          {mkDescription.length}/5000 {t("characters")}
        </div>
        <Separator className="my-2 mt-4" />
        <Label htmlFor="alTitle">{t("albanianTitle")}</Label>
        <Input
          name="alTitle"
          className="pb-2"
          id="alTitle"
          defaultValue={listing.alTitle || ""}
          maxLength={112}
          placeholder={t("albanianTitlePlaceholder")}
        />

        <Label htmlFor="alDescription">{t("albanianDescription")}</Label>
        <Textarea
          name="alDescription"
          className="pb-2"
          rows={10}
          id="alDescription"
          value={alDescription}
          maxLength={5000}
          placeholder={t("albanianDescriptionPlaceholder")}
          onChange={(e) => setAlDescription(e.target.value)}
        />
        <div className="mt-1 text-sm text-slate-400">
          {alDescription.length}/5000 {t("characters")}
        </div>
      </div>
    </div>
  );
}
