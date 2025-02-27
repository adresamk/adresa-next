"use client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import SignUpFormWrapper from "./SignUpFormWrapper";
import GoogleOAuthButton from "../GoogleOAuthButton";
import { AccountType } from "@prisma/client";
import { SubmitButton } from "@/components/SubmitButton";
interface SignUpFormProps {}
export default function SignUpForm({}: SignUpFormProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-0 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {t("auth.signUp.title")}
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          {t("auth.signUp.subtitle")}
        </p>
      </div>
      <div className="mt-6 w-full sm:mx-auto sm:max-w-sm">
        <GoogleOAuthButton role={AccountType.USER} />
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
      <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignUpFormWrapper>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("auth.signUp.email")} <span className="text-red-500">*</span>
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
                {t("auth.signUp.password")}{" "}
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
                {t("auth.signUp.confirmPassword")}{" "}
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

          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("common.contact.firstName")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("common.contact.lastName")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("common.contact.phone")}{" "}
            </label>
            <div className="mt-2">
              <input
                id="phone"
                name="phone"
                type="text"
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="my-4">
            <SubmitButton
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              loadingText={t("auth.signUp.button")}
              defaultText={t("auth.signUp.button")}
            />
          </div>
        </SignUpFormWrapper>
        <p className="mt-10 text-center text-sm text-gray-500">
          {t("auth.signUp.hasAccount")}{" "}
          <Link
            replace
            href={"/signin"}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {t("auth.signUp.signIn")}
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          <Link
            replace
            href={"/signup-agency"}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {t("auth.signUp.agencySignUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
