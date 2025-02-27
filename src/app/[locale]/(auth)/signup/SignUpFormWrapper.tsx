"use client";
import { useActionState, useEffect } from "react";
import { Form } from "@/components/Form";
import { signIn, signUpAsUser } from "@/server/actions/auth.actions";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function SignUpFormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(
    signUpAsUser,
    initialState,
  );
  const setCurrentUser = useCurrentUser((state) => state.setCurrentUser);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  useEffect(() => {
    if (state.success) {
      // router.back();
      // send to that page if it doesnt have a user created
      if (state.data?.account && !state.data?.user) {
        setCurrentUser({
          account: state.data.account,
          isAuthenticated: true,
          user: null,
          agency: null,
          admin: null,
        });
        setTimeout(() => {
          router.push("/profile/info", { locale: locale });
        }, 100);
      } else {
        console.log("This should never happen");
      }
    }
  }, [state.success, router, pathname, locale]);

  return (
    <Form action={formAction} state={state}>
      {children}
    </Form>
  );
}
