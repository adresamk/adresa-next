"use client";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Form } from "@/components/Form";
import { Link } from "@/i18n/routing";

import { useActionState, useEffect } from "react";
import { signUpAsAgency } from "@/server/actions/auth.actions";
import { useRouter } from "next/navigation";
export default function SignUp() {
  const [state, formAction] = useActionState(signUpAsAgency, {
    error: "",
    success: false,
  });
  const t = useTranslations();
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      router.push("/agency/profile/details");
    }
  }, [state.success, router]);
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

      <Alert className="mb-4 mt-10 border-orange-400 text-orange-400 sm:mx-auto sm:w-full sm:max-w-sm">
        <Info className="h-4 w-4" />
        <AlertTitle>{t("auth.agencySignUp.importantInfo")}</AlertTitle>
        <AlertDescription className="text-slate-900">
          {t("auth.agencySignUp.profileInfo")}
        </AlertDescription>
      </Alert>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Form action={formAction} state={state}>
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
                autoComplete="current-password"
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
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t("auth.agencySignUp.button")}
            </button>
          </div>
        </Form>

        <p className="mt-10 text-center text-sm text-gray-500">
          {t("auth.signUp.hasAccount")}{" "}
          <Link
            href={"/signin"}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {t("auth.signUp.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
