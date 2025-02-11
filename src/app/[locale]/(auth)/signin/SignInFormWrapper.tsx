"use client";
import { useActionState, useEffect } from "react";
import { Form } from "@/components/Form";
import { signIn } from "@/server/actions/auth.actions";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { isLoggedInClient } from "@/lib/utils";
import { getCurrentUser } from "@/lib/sessions";
import { GetCurrentUserResult, useCurrentUser } from "@/hooks/useCurrentUser";

export default function SignInFormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const setCurrentUser = useCurrentUser((state) => state.setCurrentUser);

  useEffect(() => {
    if (state.success) {
      // Revalidate all router cache
      // router.refresh();
      getCurrentUser().then((authResult: GetCurrentUserResult) => {
        console.log("authResult", authResult);
        setCurrentUser(authResult);
      });
      // Check if we're in a modal route (contains @modal)
      console.log("pathname", pathname);
      setTimeout(() => {
        console.log("otposle", window.location.href);
      }, 1000);

      toast.success(t("common.notifications.loggedInSuccessfully"), {
        duration: 2000,
        style: {
          border: "1px solid var(--brandeis-blue)",
          backgroundColor: "var(--alice-blue)",
        },
      });
      const referrer = document.referrer;
      if (referrer && referrer !== "" && referrer !== "about:blank") {
        router.back();
      } else {
        router.push("/");
      }
      // } else {
      // router.push("/");
      // }
    }
  }, [state.success, router, pathname, t, setCurrentUser]);

  useEffect(() => {
    const isLoggedIn = isLoggedInClient();
    toast.success("test");
    if (isLoggedIn) {
      console.log("isLoggedIn", isLoggedIn);
      console.log(toast);
      toast.success(
        t("common.notifications.alreadyLoggedIn") +
          " " +
          t("common.notifications.youWillBeRedirected"),
        {
          duration: 3000,
        },
      );
      const referrer = document.referrer;
      setTimeout(() => {
        if (referrer && referrer !== "" && referrer !== "about:blank") {
          router.back();
        } else {
          router.push("/");
        }
      }, 1500);
    }
  }, [router, t]);

  return (
    <Form action={formAction} state={state}>
      {children}
    </Form>
  );
}
