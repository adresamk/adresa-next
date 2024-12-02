import { Button } from "@/components/ui/button";
import { BellPlus } from "lucide-react";
import SmartOverlay from "../SmartOverlay";
import { useActionState, useEffect, useState } from "react";
import { RadioGroupDemo } from "../RadioGroupDemo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createSavedSearch } from "@/server/actions/savedSearche.actions";
import { isLoggedInClient } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
const notificationIntervalOptions = ["daily", "weekly", "live"];

export default function CreateSavedSearch() {
  const [isSavedSearchModalOpen, setIsSavedSearchModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [areNotificationsOn, setareNotificationsOn] = useState(false);
  const [searchParams, setSearchParams] = useState("");
  const [response, formAction] = useActionState(createSavedSearch, {
    success: false,
    error: null,
  });
  const t = useTranslations("");
  const notificationIntervalOptionsTranslated = notificationIntervalOptions.map(
    (option) => t(`savedSearches.notificationInterval.${option}`),
  );
  //effect description
  useEffect(() => {
    setSearchParams(window.location.href.split("/search?")[1]);
    //   const searchParams = '/search' + window.location.href.split('/search?')[1]
  }, []);

  //effect description
  useEffect(() => {
    if (response?.success) {
      setIsSavedSearchModalOpen(false);
    }
  }, [response]);
  return (
    <>
      <AlertDialog open={isAlertOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("auth.signIn.loginNeeded")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("auth.signIn.loginNeededDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsAlertOpen(false);
              }}
            >
              {t("common.actions.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction>
              <Link href="/signin?redirect=/search">
                {t("auth.signIn.title")}
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        onClick={() => {
          const isLoggedIn = isLoggedInClient();
          console.log("isLoggedIn", isLoggedIn);
          if (!isLoggedIn) {
            setIsAlertOpen(true);
            return;
          }
          setIsSavedSearchModalOpen(true);
        }}
      >
        <BellPlus className="mr-2" /> {t("common.actions.saveSearch")}
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
              defaultValue={notificationIntervalOptionsTranslated[1]}
              title=""
              values={notificationIntervalOptionsTranslated}
            />
            <div className="flex w-full items-center justify-end">
              <Button
                onClick={() => {
                  // saveSearch
                }}
              >
                {t("common.actions.save")}
              </Button>
            </div>
          </form>
        </div>
      </SmartOverlay>
    </>
  );
}
