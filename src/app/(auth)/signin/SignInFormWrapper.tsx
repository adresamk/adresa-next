"use client";
import { useActionState } from "react";
import { signIn } from "./actions";
import { Form } from "@/components/Form";

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
