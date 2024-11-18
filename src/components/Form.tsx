"use client";

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
      <p className="my-3 text-red-400">{state.error}</p>
    </form>
  );
}

export interface ActionResult {
  error: string | null;
  success: boolean;
}
