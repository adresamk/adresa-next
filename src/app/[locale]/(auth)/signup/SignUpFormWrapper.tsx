"use client";
import { useActionState, useEffect } from "react";
import { Form } from "@/components/Form";
import { signIn, signUpAsUser } from "@/server/actions/auth.actions";
import { useRouter, usePathname } from "next/navigation";

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

  useEffect(() => {
    if (state.success) {
      router.back();
      setTimeout(() => {
        router.push("/profile/info");
      }, 400);
    }
  }, [state.success, router, pathname]);

  return (
    <Form action={formAction} state={state}>
      {children}
    </Form>
  );
}
