"use client";

import { Button } from "@/components/ui/button";
import { BellPlus } from "lucide-react";
import SmartOverlay from "../SmartOverlay";
import { useActionState, useEffect, useState } from "react";
import { RadioGroupDemo } from "../RadioGroupDemo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createSavedSearch } from "@/server/actions/savedSearche.actions";
import { useTranslations } from "next-intl";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const notificationIntervalOptions = ["daily", "weekly", "live"];

export default function CreateSavedSearch() {
  const [isSavedSearchModalOpen, setIsSavedSearchModalOpen] = useState(false);
  const [areNotificationsOn, setareNotificationsOn] = useState(false);
  const [searchParams, setSearchParams] = useState("");
  const [response, formAction] = useActionState(createSavedSearch, {
    success: false,
    error: null,
  });
  const t = useTranslations("");
  const { withAuthCheck, AuthDialog } = useAuthGuard();

  const notificationIntervalOptionsTranslated = notificationIntervalOptions.map(
    (option) => {
      return {
        value: option,
        label: t(`savedSearches.notificationInterval.${option}`),
      };
    },
  );

  useEffect(() => {
    setSearchParams(window.location.href.split("/search?")[1]);
  }, []);

  useEffect(() => {
    if (response?.success) {
      setIsSavedSearchModalOpen(false);
    }
  }, [response]);

  return (
    <>
      <AuthDialog />
      <Button
        className="h-8 px-1.5 py-0.5 md:h-10 md:px-2 md:py-1"
        onClick={() => {
          withAuthCheck(() => {
            setIsSavedSearchModalOpen(true);
            return Promise.resolve();
          });
        }}
      >
        <BellPlus className="mr-2 h-4 w-4 md:h-5 md:w-5" />{" "}
        {t("common.actions.saveSearch")}
      </Button>
      <SmartOverlay
        isOpen={isSavedSearchModalOpen}
        onClose={() => setIsSavedSearchModalOpen(false)}
        title={t("common.actions.saveSearch")}
        description={t("savedSearches.saveSearchDescription")}
        innerScroll
        footerJSX={null}
      >
        <div className="flex flex-col gap-3 px-2">
          <form action={formAction}>
            <input
              type="text"
              className="hidden"
              name="searchParams"
              defaultValue={searchParams}
            />
            <Label htmlFor="name">{t("common.inputs.savedSearchName")}</Label>
            <Input
              placeholder={t("common.inputs.savedSearchNamePlaceholder")}
              required
              minLength={3}
              maxLength={50}
              defaultValue={""}
              name="name"
              id={"name"}
            />
            <div className="my-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                width={380}
                height={230}
                src="/assets/saved-search-map-polygon2.png"
                alt="saved search polygon img"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="isNotificationOn" className="text-xl">
                {t("savedSearches.notifications")}
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="hidden"
                  name="isNotificationOn"
                  defaultValue={areNotificationsOn ? "on" : "off"}
                />
                <Input
                  className=""
                  type="checkbox"
                  checked={areNotificationsOn}
                  onChange={(e) => {
                    setareNotificationsOn(e.target.checked);
                  }}
                  id={"isNotificationOn"}
                />
                <span className="text-base">
                  {areNotificationsOn
                    ? t("common.actions.on")
                    : t("common.actions.off")}
                </span>
              </div>
            </div>
            <RadioGroupDemo
              name="notificationInterval"
              defaultValue={notificationIntervalOptionsTranslated[1].value}
              title={t("savedSearches.notificationInterval.title")}
              options={notificationIntervalOptionsTranslated}
            />
            <div className="flex w-full items-center justify-end">
              <Button type="submit">{t("common.actions.save")}</Button>
            </div>
          </form>
        </div>
      </SmartOverlay>
    </>
  );
}
