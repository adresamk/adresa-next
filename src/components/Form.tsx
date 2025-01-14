"use client";

import { useTranslations } from "next-intl";
import { startTransition } from "react";

export function Form({
  children,
  action,
  state,
  className,
}: {
  children: React.ReactNode;
  action: (formData: FormData) => void;
  state: ActionResult;
  className?: string;
}) {
  const t = useTranslations("auth");
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(() => {
      action(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      {state.error && (
        <p className="my-3 text-red-400">{t(`errors.${state.error}`)}</p>
      )}
    </form>
  );
}

export interface ActionResult {
  error: string | null;
  success: boolean;
}
