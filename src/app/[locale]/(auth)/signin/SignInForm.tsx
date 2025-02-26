"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

import GoogleOAuthButton from "../GoogleOAuthButton";
import SignInFormWrapper from "./SignInFormWrapper";
import { AccountType } from "@prisma/client";

interface SignInFormProps {
  searchParams: Record<string, string> | null;
}

export default function SignInForm({ searchParams = null }: SignInFormProps) {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {t("auth.signIn.title")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("auth.signIn.subtitle")}
        </p>
      </div>

      <div className="mt-6 w-full sm:mx-auto sm:max-w-sm">
        <GoogleOAuthButton role={AccountType.USER} />
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              {t("auth.oauth.or")}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignInFormWrapper>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("auth.signIn.email")} <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t("auth.signIn.password")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="text-sm">
                <Link
                  replace
                  href="/forgot-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  {t("auth.signIn.forgotPassword")}
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t("auth.signIn.button")}
            </button>
          </div>
        </SignInFormWrapper>

        <p className="mt-10 text-center text-sm text-gray-500">
          {t("auth.signIn.noAccount")}{" "}
          <Link
            replace
            href={"/signup"}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {t("auth.signIn.createAccount")}
          </Link>
        </p>
      </div>
    </div>
  );
}
