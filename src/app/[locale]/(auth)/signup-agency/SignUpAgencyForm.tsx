"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Form } from "@/components/Form";
import { Link } from "@/i18n/routing";
import SignUpAgencyFormWrapper from "./SignUpAgencyFormWrapper";
import GoogleOAuthButton from "../GoogleOAuthButton";
import { AccountType } from "@prisma/client";
import { SubmitButton } from "@/components/SubmitButton";

interface SignUpAgencyFormProps {}
export default function SignUpAgencyForm({}: SignUpAgencyFormProps) {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {t("auth.agencySignUp.title")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("auth.agencySignUp.subtitle")}
        </p>
      </div>

      <Alert className="mb-4 mt-10 border-orange-400 p-2 text-sm text-orange-400 sm:mx-auto sm:w-full sm:max-w-sm">
        <Info className="m-0 h-4 w-4" />
        <AlertTitle className="mt-2">
          {t("auth.agencySignUp.important")}
        </AlertTitle>
        <AlertDescription className="text-slate-900">
          {t("auth.agencySignUp.profileInfo")}
        </AlertDescription>
      </Alert>
      <div className="mt-6 w-full sm:mx-auto sm:max-w-sm">
        <GoogleOAuthButton role={AccountType.AGENCY} />
        <div className="relative my-2">
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
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <SignUpAgencyFormWrapper>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("auth.agencySignUp.email")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="off"
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
                {t("auth.agencySignUp.password")}{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t("auth.agencySignUp.confirmPassword")}{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="mt-2">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="my-4">
            <SubmitButton
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
              loadingText={t("auth.agencySignUp.button")}
              defaultText={t("auth.agencySignUp.button")}
            />
          </div>
        </SignUpAgencyFormWrapper>

        <p className="mt-10 text-center text-sm text-gray-500">
          {t("auth.signUp.hasAccount")}{" "}
          <Link
            href={"/signin"}
            replace
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {t("auth.signUp.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
