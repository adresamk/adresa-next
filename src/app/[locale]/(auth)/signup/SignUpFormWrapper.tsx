"use client";
import { useActionState, useEffect } from "react";
import { Form } from "@/components/Form";
import { signIn, signUpAsUser } from "@/server/actions/auth.actions";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

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
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  useEffect(() => {
    if (state.success) {
      router.back();
      setTimeout(() => {
        router.push("/profile/info", { locale: locale });
      }, 400);
    }
  }, [state.success, router, pathname, locale]);

  return (
    <Form action={formAction} state={state}>
      {children}
    </Form>
  );
}
