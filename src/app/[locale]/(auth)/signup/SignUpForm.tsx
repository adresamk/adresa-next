"use client";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import GoogleOAuthButton from "../GoogleOAuthButton";
import { AccountType } from "@prisma/client";
import { SubmitButton } from "@/components/SubmitButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "@/i18n/routing";
import { signUpAsUser } from "@/server/actions/auth.actions";
import { Form } from "@/components/Form";
interface SignUpFormProps {}
export default function SignUpForm({}: SignUpFormProps) {
  const t = useTranslations();
  const initialState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(
    signUpAsUser,
    initialState,
  );
  const setCurrentUser = useCurrentUser((state) => state.setCurrentUser);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  useEffect(() => {
    if (state.success) {
      setCurrentUser({
        account: state.data.account,
        isAuthenticated: true,
        user: state.data.user,
        agency: null,
        admin: null,
      });

      router.back();
      setTimeout(() => {
        router.refresh();
      }, 100);
    }
  }, [state.success, router, pathname, locale, setCurrentUser, state.data]);
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
        <Form action={formAction} state={state}>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("auth.signUp.email")} <span className="text-red-500">*</span>
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
                {t("auth.signUp.password")}{" "}
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
                {t("auth.signUp.confirmPassword")}{" "}
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

          <div>
            <Label
              htmlFor="firstName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("common.contact.firstName")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="mb-2">
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                autoComplete="off"
                className="block w-full shadow-sm"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="lastName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("common.contact.lastName")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="mb-2">
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                autoComplete="off"
                className="block w-full shadow-sm"
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="phone"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t("common.contact.phone")}{" "}
            </Label>
            <div className="mb-2">
              <Input
                id="phone"
                name="phone"
                type="text"
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
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              loadingText={t("auth.signUp.button")}
              defaultText={t("auth.signUp.button")}
            />
          </div>
        </Form>
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
