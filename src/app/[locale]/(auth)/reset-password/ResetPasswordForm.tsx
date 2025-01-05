"use client";

import { resetPassword } from "@/server/actions/auth.actions";
import { useActionState } from "react";
import { useTranslations } from "next-intl";

export default function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState(resetPassword, {
    success: false,
    error: null,
  });
  return (
    <div>
      <h1>Reset Password</h1>
      <form action={formAction}>
        <input type="hidden" defaultValue={token} name="token" />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {state.error && <p>{state.error}</p>}
      {state.success && (
        <p>{t("auth.forgotPassword.passwordUpdatedSuccessfully")}</p>
      )}
    </div>
  );
}
