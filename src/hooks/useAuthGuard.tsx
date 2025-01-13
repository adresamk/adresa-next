"use client";

import { useState } from "react";
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

export function useAuthGuard() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const t = useTranslations();

  const withAuthCheck = async <T,>(action: () => Promise<T>) => {
    if (!isLoggedInClient()) {
      setIsAuthDialogOpen(true);
      return null;
    }
    return action();
  };

  const AuthDialog = () => (
    <AlertDialog open={isAuthDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("auth.signIn.loginNeeded")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("auth.signIn.loginMessage")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setIsAuthDialogOpen(false);
            }}
          >
            {t("common.actions.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setIsAuthDialogOpen(false);
            }}
          >
            <Link href="/signin">{t("common.actions.signIn")}</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    withAuthCheck,
    AuthDialog,
    isAuthDialogOpen,
    setIsAuthDialogOpen,
  };
}
