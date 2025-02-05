import { checkResetPasswordTokenValidity } from "@/server/actions/auth.actions";
import { Link } from "@/i18n/routing";

import { getTranslations } from "next-intl/server";
import ResetPasswordForm from "./ResetPasswordForm";
import { Metadata } from "next";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token: string;
  }>;
}
export const metadata: Metadata = {
  title: "Ресетирај лозинка",
  description: "Ресетирање на лозинка на профил на Adresa.mk",
};
export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const t = await getTranslations();
  const { success, error } = await checkResetPasswordTokenValidity(
    params.token,
  );
  if (!success && error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
          <div className="text-center">
            <div className="text-lg font-medium text-red-600">{error}</div>
            <p className="mb-4 text-sm text-slate-600">
              {t("auth.resetPassword.tokenExpired")}
            </p>
            <Link
              href="/"
              className="inline-flex justify-center rounded-md border border-transparent bg-brand-light-blue px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              {t("auth.resetPassword.backToHomepage")}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return <ResetPasswordForm token={params.token} />;
}
