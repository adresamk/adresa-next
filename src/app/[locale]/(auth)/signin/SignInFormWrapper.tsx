"use client";
import { useActionState, useEffect } from "react";
import { Form } from "@/components/Form";
import { signIn } from "@/server/actions/auth.actions";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function SignInFormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations();
  const setCurrentUser = useCurrentUser((state) => state.setCurrentUser);

  useEffect(() => {
    if (state.success) {
      // Revalidate all router cache
      // router.refresh();

      setCurrentUser({
        account: state.data.account,
        isAuthenticated: true,
        user: state.data.user,
        agency: state.data.agency,
        admin: null,
      });

      toast.success(t("common.notifications.loggedInSuccessfully"), {
        duration: 2000,
        style: {
          border: "1px solid var(--brandeis-blue)",
          backgroundColor: "var(--alice-blue)",
        },
      });
      router.back();
      const referrer = document.referrer;
      console.log("referrer", referrer);
      // if (referrer && referrer !== "" && referrer !== "about:blank") {
      //   console.log("referrer ima", referrer);
      // } else {
      //   router.push("/");
      // }
    }
  }, [state.success, router, pathname, t, setCurrentUser]);

  return (
    <Form action={formAction} state={state}>
      {children}
    </Form>
  );
}
