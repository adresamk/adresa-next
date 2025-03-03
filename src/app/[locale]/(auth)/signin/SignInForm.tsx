"use client";

import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

import GoogleOAuthButton from "../GoogleOAuthButton";
import { AccountType } from "@prisma/client";
import { SubmitButton } from "@/components/SubmitButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/Form";
import { toast } from "sonner";
import { useActionState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { signIn } from "@/server/actions/auth.actions";

interface SignInFormProps {
  searchParams: Record<string, string> | null;
}

export default function SignInForm({ searchParams = null }: SignInFormProps) {
  const t = useTranslations();
  const initialState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const setCurrentUser = useCurrentUser((state) => state.setCurrentUser);

  useEffect(() => {
    if (state.success) {
      // Revalidate all router cache
      // router.refresh();

      setCurrentUser({
        account: state.data.account,
        isAuthenticated: true,
        user: state.data.user,
        agency: state.data.agency,
        admin: null,
      });

      toast.success(t("common.notifications.loggedInSuccessfully"), {
        duration: 2000,
        style: {
          border: "1px solid var(--brandeis-blue)",
          backgroundColor: "var(--alice-blue)",
        },
      });
      router.back();
      const referrer = document.referrer;
      console.log("referrer", referrer);
      // if (referrer && referrer !== "" && referrer !== "about:blank") {
      //   console.log("referrer ima", referrer);
      // } else {
      //   router.push("/");
      // }
    }
  }, [router, pathname, t, setCurrentUser, state]);

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
        {/* Passing role here doesn't matter it's to justify requrirement for prop, but it takes care base on current user type, if they don't have account we assume they want to make USER account */}
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
        <Form action={formAction} state={state}>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("auth.signIn.email")} <span className="text-red-500">*</span>
            </Label>
            <div className="mb-2">
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full shadow-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t("auth.signIn.password")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="text-sm">
                <Link
                  replace
                  tabIndex={-1}
                  href={`/${locale}/forgot-password`}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  {t("auth.signIn.forgotPassword")}
                </Link>
              </div>
            </div>
            <div className="mb-2">
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full shadow-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <SubmitButton
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
              loadingText={t("auth.signIn.button")}
              defaultText={t("auth.signIn.button")}
            />
          </div>
        </Form>

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
