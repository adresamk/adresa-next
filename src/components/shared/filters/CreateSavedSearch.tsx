"use client";

import { Button } from "@/components/ui/button";
import { BellPlus } from "lucide-react";
import SmartOverlay from "../SmartOverlay";
import { useActionState, useEffect, useState } from "react";
import { RadioGroupDemo } from "../RadioGroupDemo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createSavedSearch } from "@/server/actions/savedSearche.actions";
import { useLocale, useTranslations } from "next-intl";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useParams, usePathname } from "next/navigation";
import SavedSearchPromoDialog from "./SavedSearchPromoDialog";
import { isLoggedInClient, readFromLocalStorage } from "@/lib/utils";
import { markPromoDialogAsSeen } from "@/client/actions/savedSearches";
import { useRouter } from "@/i18n/routing";

const notificationIntervalOptions = ["live", "daily", "weekly"];

export default function CreateSavedSearch() {
  const router = useRouter();
  const locale = useLocale();
  const [isSavedSearchModalOpen, setIsSavedSearchModalOpen] = useState(false);
  const [isSavedSearchPromoDialogOpen, setIsSavedSearchPromoDialogOpen] =
    useState(false);
  const [areNotificationsOn, setareNotificationsOn] = useState(false);
  const pathname = usePathname();
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
    if (pathname) {
      setSearchParams(pathname);
    }
  }, [pathname]);

  //open randomly
  useEffect(() => {
    const timesSeen = readFromLocalStorage("savedSearchPromoDialogSeen") || 0;
    // Probability decreases as timesSeen increases
    // timesSeen: 0 -> 100% chance (1.0)
    // timesSeen: 1 -> 80% chance (0.8)
    // timesSeen: 2 -> 60% chance (0.6)
    // timesSeen: 3 -> 40% chance (0.4)
    // timesSeen: 4 -> 20% chance (0.2)
    const probability = Math.max(0, 1 - timesSeen * 0.2);
    const shouldShow =
      timesSeen < 5 && Math.random() < probability && !isLoggedInClient();

    if (shouldShow) {
      setTimeout(() => {
        setIsSavedSearchPromoDialogOpen(true);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    if (response?.success) {
      setIsSavedSearchModalOpen(false);
    }
  }, [response]);

  const defaultName = "";

  return (
    <>
      <SavedSearchPromoDialog
        isOpen={isSavedSearchPromoDialogOpen}
        onConfirm={() => {
          setIsSavedSearchPromoDialogOpen(false);
          markPromoDialogAsSeen();
          router.push("/signin");
        }}
        onClose={() => {
          setIsSavedSearchPromoDialogOpen(false);
          markPromoDialogAsSeen();
        }}
      />
      <Button
        className="fixed right-2 top-[150px] z-[30000] h-12 animate-bounce items-center justify-center rounded-full p-4 px-1.5 py-0.5 duration-1500 ![transform:translateZ(999999px)] md:static md:h-10 md:animate-none md:rounded-md md:px-2 md:py-1"
        style={{
          // position: "fixed",
          // zIndex: 999999,
          WebkitTransform: "translateZ(999999px)",
          transform: "translateZ(999999px)",
        }}
        onClick={() => {
          withAuthCheck(() => {
            setIsSavedSearchModalOpen(true);
            return Promise.resolve();
          });
        }}
      >
        <BellPlus className="m-2 mr-2 h-6 w-6 md:mr-2 md:h-5 md:w-5" />
        <span className="hidden md:block">
          {t("common.actions.saveSearch")}
        </span>
      </Button>
      <SmartOverlay
        isOpen={isSavedSearchModalOpen}
        onClose={() => setIsSavedSearchModalOpen(false)}
        title={t("common.actions.saveSearch")}
        description={t("savedSearches.saveSearchDescription")}
        innerScroll
        footerJSX={null}
      >
        <div className="mx-auto mb-10 flex max-w-md flex-col gap-3 px-2 md:mb-0">
          <form action={formAction}>
            <input
              type="text"
              className="hidden"
              name="searchParams"
              value={searchParams}
              onChange={(e) => {
                // setSearchParams(e.target.value);
              }}
            />
            <Label htmlFor="name">{t("savedSearches.savedSearchName")}</Label>
            <Input
              placeholder={t("savedSearches.savedSearchNamePlaceholder")}
              required
              minLength={3}
              className="my-2"
              maxLength={50}
              defaultValue={defaultName}
              name="name"
              id={"name"}
            />
            <div className="my-2 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                width={440}
                height={140}
                className="aspect-video h-[144px] w-[230px]"
                src="/assets/saved-search-map-polygon2.png"
                alt="saved search polygon img"
              />
            </div>

            <div className="flex items-start gap-2 px-2">
              <RadioGroupDemo
                name="notificationInterval"
                defaultValue={notificationIntervalOptionsTranslated[1].value}
                title={t("savedSearches.notificationInterval.title")}
                options={notificationIntervalOptionsTranslated}
              />
              <div className="ml-auto mt-4 flex items-start gap-2">
                <Label
                  htmlFor="isNotificationOnCheckbox"
                  className="text-right text-lg leading-4"
                >
                  {t("savedSearches.notifications")}
                </Label>
                <input
                  type="text"
                  className="hidden"
                  name="isNotificationOn"
                  id="isNotificationOn"
                  value={areNotificationsOn ? "on" : "off"}
                  onChange={(e) => {
                    // setareNotificationsOn(e.target.checked);
                  }}
                />
                <Input
                  className="h-4 w-4"
                  type="checkbox"
                  checked={areNotificationsOn}
                  onChange={(e) => {
                    setareNotificationsOn(e.target.checked);
                  }}
                  id={"isNotificationOnCheckbox"}
                />
                {/* <span className="text-base">
                  {areNotificationsOn
                    ? t("common.actions.on")
                    : t("common.actions.off")}
                </span> */}
              </div>
            </div>

            <div className="flex w-full items-center justify-end">
              <Button type="submit">{t("common.actions.save")}</Button>
            </div>
          </form>
        </div>
      </SmartOverlay>
    </>
  );
}
