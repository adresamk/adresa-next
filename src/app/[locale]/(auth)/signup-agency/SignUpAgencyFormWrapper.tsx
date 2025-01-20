"use client";
import { useActionState, useEffect } from "react";
import { Form } from "@/components/Form";
import {
  signIn,
  signUpAsAgency,
  signUpAsUser,
} from "@/server/actions/auth.actions";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function SignUpAgencyFormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(
    signUpAsAgency,
    initialState,
  );
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  useEffect(() => {
    if (state.success) {
      router.back();
      setTimeout(() => {
        router.push("/agency/profile/details", { locale: locale });
      }, 400);
    }
  }, [state.success, router, pathname, locale]);

  return (
    <Form action={formAction} state={state}>
      {children}
    </Form>
  );
}
