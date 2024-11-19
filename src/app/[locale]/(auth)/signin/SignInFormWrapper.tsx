"use client";
import { useActionState } from "react";
import { Form } from "@/components/Form";
import { signIn } from "@/server/actions/auth.actions";

export default function SignInFormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <Form action={formAction} state={state}>
      {children}
    </Form>
  );
}
