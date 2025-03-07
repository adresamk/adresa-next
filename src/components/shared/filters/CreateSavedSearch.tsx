"use client";

import { Button } from "@/components/ui/button";
import { BellPlus, CheckCircle } from "lucide-react";
import SmartOverlay from "../SmartOverlay";
import { useActionState, useEffect, useState } from "react";
import { RadioGroupDemo } from "../RadioGroupDemo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createSavedSearch } from "@/server/actions/savedSearche.actions";
import { useLocale, useTranslations } from "next-intl";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { usePathname } from "next/navigation";
import SavedSearchPromoDialog from "./SavedSearchPromoDialog";
import { cn, isLoggedInClient, readFromLocalStorage } from "@/lib/utils";
import { markPromoDialogAsSeen } from "@/client/actions/savedSearches";
import { useRouter } from "@/i18n/routing";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SubmitButton } from "@/components/SubmitButton";
import { toast } from "sonner";
import { parseQueryParams } from "@/lib/filters";
import { getAllMunicipalitiesWithPlacesTranslated } from "@/lib/data/macedonia/importantData";
import { Checkbox } from "@/components/ui/checkbox";

const notificationIntervalOptions = ["live", "daily", "weekly"];

export default function CreateSavedSearch() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const [isSavedSearchModalOpen, setIsSavedSearchModalOpen] = useState(false);
  const [isSSSaved, setIsSSSaved] = useState(false);
  const [isSavedSearchPromoDialogOpen, setIsSavedSearchPromoDialogOpen] =
    useState(false);
  const [areNotificationsOn, setareNotificationsOn] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const [searchParams, setSearchParams] = useState("");
  const [response, formAction, isPending] = useActionState(createSavedSearch, {
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
      setSearchParams(pathname + window.location.search);
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
      setIsSSSaved(true);
      setTimeout(() => {
        setIsSavedSearchModalOpen(false);
        toast.success(t("common.actions.savedSearch"));
        setIsSSSaved(false);
      }, 1500);
    }
  }, [response, t]);

  // console.log({ searchParams });
  const pqp = parseQueryParams(pathname.split("/"));
  const isAgencySearch = pathname.includes("/agency");
  const isMissingTransactionType = !pathname.includes("tt-");
  if (isAgencySearch && isMissingTransactionType) {
    pqp.transactionType = "all";
  }
  // console.log({ pqp });
  const municipalities = getAllMunicipalitiesWithPlacesTranslated(locale);
  let allTogether = municipalities.map((m) => {
    return [
      { label: m.label, value: m.value },
      ...(m.places?.map((p) => ({ label: p.label, value: p.value })) || []),
    ].flat(1);
  });

  // Fix the type assertion
  const flattenedLocations = allTogether.flat(1) as Array<{
    label: string;
    value: string;
  }>;

  const bigObjectMap = flattenedLocations.reduce<Record<string, string[]>>(
    (acc, curr) => {
      if (acc[curr.value]) {
        acc[curr.value] = [...acc[curr.value], curr.label];
      } else {
        acc[curr.value] = [curr.label];
      }
      return acc;
    },
    {},
  );
  // console.log({ bigObjectMap });

  let locationsTranslatedArray = !Array.isArray(pqp.location)
    ? [pqp.location]
    : pqp.location;
  locationsTranslatedArray = locationsTranslatedArray.map((l) => {
    return bigObjectMap[l]?.join(", ");
  });

  const locationsTranslated = locationsTranslatedArray.join("; ");
  let locationOrAgency = "";
  if (isAgencySearch && !locationsTranslated) {
    const agencySlug = pathname.split("/")[2];
    locationOrAgency = t(`common.words.from`) + " " + agencySlug;
  } else if (locationsTranslated) {
    locationOrAgency = t(`common.words.in`) + " " + locationsTranslated;
  }
  const defaultName = `${pqp.type ? t(`common.property.type.plural.${pqp.type}`) : (pqp.category && t(`search.filters.category.${pqp.category}`)) || t("common.words.allOfThem")} ${t(`common.words.for`)} ${pqp.transactionType && t(`search.filters.mode.${pqp.transactionType === "all" ? "both" : pqp.transactionType}`).toLowerCase()} ${locationOrAgency}`;

  // if (pathname.includes("/agency")) {
  //   return null;
  // }
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
        className="fixed right-2 top-[150px] z-[30000] h-12 animate-bounce items-center justify-center rounded-full p-4 px-1.5 py-0.5 duration-1500 ![transform:translateZ(999999px)] md:static md:h-10 md:animate-none md:px-4 md:py-1"
        style={{
          // position: "fixed",
          // zIndex: 999999,
          WebkitTransform: "translateZ(999999px)",
          transform: "translateZ(999999px)",
        }}
        disabled={!user}
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
      {user && (
        <>
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
                <Label htmlFor="name">
                  {t("savedSearches.savedSearchName")}
                </Label>
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
                    src="/assets/region-map-preview.png"
                    alt="saved search polygon img"
                  />
                </div>

                <div className="flex items-start gap-2 px-2">
                  <RadioGroupDemo
                    allDisabled={!areNotificationsOn}
                    name="notificationInterval"
                    defaultValue={
                      notificationIntervalOptionsTranslated[2].value
                    }
                    title={t("savedSearches.notificationInterval.title")}
                    options={notificationIntervalOptionsTranslated}
                  />
                  <div className="ml-auto mt-4 flex items-start gap-2">
                    <Label
                      htmlFor="isNotificationOnCheckbox"
                      className="text-right text-base leading-4"
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
                    <Checkbox
                      className="h-4 w-4"
                      // type="checkbox"
                      checked={areNotificationsOn}
                      onCheckedChange={(nextValue) => {
                        setareNotificationsOn(!!nextValue);
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
                  <div>
                    {!isSSSaved && (
                      <SubmitButton
                        key={"toSave"}
                        loadingText={t("common.actions.saving")}
                        defaultText={t("common.actions.save")}
                        disabled={isPending}
                        // className={cn(
                        //   "bg-brand-light-blue",
                        //   isSSSaved && "bg-green-600",
                        // )}
                      />
                    )}
                  </div>
                  <div>
                    {isSSSaved && (
                      <Button
                        key={"saved"}
                        type="button"
                        className="bg-green-600"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />{" "}
                        {t("common.actions.saved")}
                      </Button>
                    )}
                  </div>

                  {/* <Button type="submit">{t("common.actions.save")}</Button> */}
                </div>
              </form>
            </div>
          </SmartOverlay>
        </>
      )}
    </>
  );
}
