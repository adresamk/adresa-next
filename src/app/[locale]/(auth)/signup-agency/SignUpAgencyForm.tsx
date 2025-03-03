"use client";

import { Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Form } from "@/components/Form";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import GoogleOAuthButton from "../GoogleOAuthButton";
import { AccountType } from "@prisma/client";
import { SubmitButton } from "@/components/SubmitButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { signUpAsAgency } from "@/server/actions/auth.actions";
import { useActionState, useEffect } from "react";

interface SignUpAgencyFormProps {}
export default function SignUpAgencyForm({}: SignUpAgencyFormProps) {
  const t = useTranslations();
  const initialState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(
    signUpAsAgency,
    initialState,
  );
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  useEffect(() => {
    if (state.success) {
      router.back();
      setTimeout(() => {
        router.push("/agency/profile/details", { locale: locale });
      }, 400);
    }
  }, [state.success, router, pathname, locale]);
  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-4 lg:px-8">
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
        <Form action={formAction} state={state}>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("auth.agencySignUp.email")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="mb-2">
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="off"
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
                {t("auth.agencySignUp.password")}{" "}
                <span className="text-red-500">*</span>
              </Label>
            </div>
            <div className="mb-2">
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="off"
                className="block w-full shadow-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="confirm-password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t("auth.agencySignUp.confirmPassword")}{" "}
                <span className="text-red-500">*</span>
              </Label>
            </div>
            <div className="mb-2">
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                autoComplete="off"
                className="block w-full shadow-sm"
              />
            </div>
          </div>

          <Separator className="my-2 mt-4" />

          <div className="my-3 flex gap-2">
            <Checkbox id="terms" defaultChecked required name="terms" />
            <Label
              htmlFor="terms"
              className="max-w-[400px] text-xs leading-4 text-slate-700"
            >
              {t("listing.new.agreeToTerms")}

              <Link
                href="/terms-of-use"
                target="_blank"
                className="ml-2 text-brand-light-blue underline"
              >
                {t("footer.Terms of Use")}
              </Link>
            </Label>
          </div>

          <div className="my-3 flex gap-2">
            <Checkbox
              id="listingTerms"
              defaultChecked
              required
              name="listingTerms"
            />
            <Label
              htmlFor="listingTerms"
              className="max-w-[400px] text-xs leading-4 text-slate-700"
            >
              {t("listing.new.agreeToListingTerms")}

              <Link
                href="/terms-for-listings"
                target="_blank"
                className="ml-2 text-brand-light-blue underline"
              >
                {t("footer.Terms for Listings")}
              </Link>
            </Label>
          </div>

          <div className="my-3 flex gap-2">
            <Checkbox id="dataUsage" defaultChecked required name="dataUsage" />
            <Label
              htmlFor="dataUsage"
              className="max-w-[400px] text-xs leading-4 text-slate-700"
            >
              {t("listing.new.agreeToDataUsage")}

              <Link
                href="/privacy-policy"
                target="_blank"
                className="ml-2 text-brand-light-blue underline"
              >
                {t("footer.Policies")}
              </Link>
            </Label>
          </div>

          <div className="my-4">
            <SubmitButton
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
              loadingText={t("auth.agencySignUp.button")}
              defaultText={t("auth.agencySignUp.button")}
            />
          </div>
        </Form>

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
