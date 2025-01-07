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
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("auth.resetPassword.title")}
          </h1>
        </div>
        <form className="mt-8 space-y-6" action={formAction}>
          <input type="hidden" defaultValue={token} name="token" />
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="newPassword">
                {t("auth.resetPassword.newPassword")}
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">
                {t("auth.resetPassword.confirmPassword")}
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending || state.success}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isPending
                ? t("auth.resetPassword.resetting")
                : t("auth.resetPassword.resetPassword")}
            </button>
          </div>
        </form>
        {state.error && (
          <p className="mt-2 text-center text-sm text-red-600">{state.error}</p>
        )}
        {state.success && (
          <p className="mt-2 text-center text-sm text-green-600">
            {t("auth.forgotPassword.passwordUpdatedSuccessfully")}
          </p>
        )}
      </div>
    </div>
  );
}
