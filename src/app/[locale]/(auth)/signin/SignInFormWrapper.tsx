"use client";
import { useActionState, useEffect } from "react";
import { Form } from "@/components/Form";
import { signIn } from "@/server/actions/auth.actions";
import { useRouter } from "next/navigation";

export default function SignInFormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      if (document.referrer.startsWith(window.location.origin)) {
        router.back();
      } else {
        router.push("/");
      }
    }
  }, [state.success, router]);

  return (
    <Form action={formAction} state={state}>
      {children}
    </Form>
  );
}
