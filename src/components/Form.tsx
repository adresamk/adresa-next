"use client";

import { useFormState } from "react-dom";

export function Form({
  children,
  action,
}: {
  children: React.ReactNode;
  action: (
    prevState: any,
    formData: FormData
  ) => Promise<ActionResult>;
}) {
  const [state, formAction] = useFormState(action, {
    error: null,
    success: false,
  });
  return (
    <form action={formAction}>
      {children}
      <p className="my-3 text-red-400">{state.error}</p>
    </form>
  );
}

export interface ActionResult {
  error: string | null;
  success: boolean;
}
