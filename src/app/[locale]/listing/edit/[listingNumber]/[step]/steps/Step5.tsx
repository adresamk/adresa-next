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

  const [engDescription, setEngDescription] = useState(
    listing.description || "",
  );
  const [mkdDescription, setMkdDescription] = useState(
    listing.mkdDescription || "",
  );
  const [albDescription, setAlbDescription] = useState(
    listing.albDescription || "",
  );

  return (
    <div className="p-2">
      <input type="string" className="hidden" defaultValue="5" name="step" />

      <h2 className="text-lg">{t("title")}</h2>
      <Separator className="my-2 mt-4" />

      <div className="flex flex-col gap-2">
        <Label htmlFor="engTitle">{t("englishTitle")}</Label>
        <Input
          name="engTitle"
          className="pb-2"
          id="engTitle"
          defaultValue={listing.title || ""}
          maxLength={112}
          placeholder={t("englishTitlePlaceholder")}
        />

        <Label htmlFor="engDescription">{t("englishDescription")}</Label>
        <Textarea
          name="engDescription"
          className="pb-2"
          rows={10}
          id="engDescription"
          value={engDescription}
          maxLength={5000}
          placeholder={t("englishDescriptionPlaceholder")}
          onChange={(e) => setEngDescription(e.target.value)}
        />
        <div className="mt-1 text-sm text-slate-400">
          {engDescription.length}/5000 {t("characters")}
        </div>
        <Separator className="my-2 mt-4" />
        <Label htmlFor="mkdTitle">{t("macedonianTitle")}</Label>
        <Input
          name="mkdTitle"
          className="pb-2"
          id="mkdTitle"
          defaultValue={listing.mkdTitle || ""}
          maxLength={112}
          placeholder={t("macedonianTitlePlaceholder")}
        />

        <Label htmlFor="mkdDescription">{t("macedonianDescription")}</Label>
        <Textarea
          name="mkdDescription"
          className="pb-2"
          rows={10}
          id="mkdDescription"
          value={mkdDescription}
          maxLength={5000}
          placeholder={t("macedonianDescriptionPlaceholder")}
          onChange={(e) => setMkdDescription(e.target.value)}
        />
        <div className="mt-1 text-sm text-slate-400">
          {mkdDescription.length}/5000 {t("characters")}
        </div>
        <Separator className="my-2 mt-4" />
        <Label htmlFor="albTitle">{t("albanianTitle")}</Label>
        <Input
          name="albTitle"
          className="pb-2"
          id="albTitle"
          defaultValue={listing.albTitle || ""}
          maxLength={112}
          placeholder={t("albanianTitlePlaceholder")}
        />

        <Label htmlFor="albDescription">{t("albanianDescription")}</Label>
        <Textarea
          name="albDescription"
          className="pb-2"
          rows={10}
          id="albDescription"
          value={albDescription}
          maxLength={5000}
          placeholder={t("albanianDescriptionPlaceholder")}
          onChange={(e) => setAlbDescription(e.target.value)}
        />
        <div className="mt-1 text-sm text-slate-400">
          {albDescription.length}/5000 {t("characters")}
        </div>
      </div>
    </div>
  );
}
