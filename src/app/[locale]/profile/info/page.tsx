import { SubmitButton } from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/sessions";
import { updateUserInfo } from "@/server/actions/user.actions";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

type Params = Promise<Record<string, string>>;
export const metadata: Metadata = {
  title: "Основни информации",
  description: "Основни информации за корисничкиот профил на Adresa.mk",
};
export default async function ProfileInfoPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const params = await searchParams;
  const { isAuthenticated, user, account } = await getCurrentUser();
  const t = await getTranslations();
  // if (!user) {
  //   redirect("/signin?redirect=/profile/info");
  // }
  return (
    <div className="mt-4 rounded-lg bg-white p-4 shadow md:ml-4 md:max-w-lg md:p-8">
      <h3 className="mb-3 text-2xl font-semibold">
        {t("user.profile.info.title")}
      </h3>
      <form
        className="py-2"
        action={async (formData: FormData) => {
          "use server";
          const result = await updateUserInfo(formData);
          if (result?.success) {
            // if (result.data?.account && !result.data?.user) {
            //   setCurrentUser({
            //     account: result.data.account,
            //     isAuthenticated: true,
            //     user: null,
            //     agency: null,
            //     admin: null,
            //   });
            // }
            revalidatePath("/profile/info");
            // getCurrentUser().then((authResult: GetCurrentUserResult) => {
            //   console.log("authResult", authResult);
            //   setCurrentUser(authResult);
            //   redirect({ href: "/", locale: locale });
            // });
          }
        }}
      >
        <div className="mb-3 flex flex-col gap-1">
          <Label htmlFor="firstName">
            {t("user.profile.info.firstName")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="firstName"
            defaultValue={user?.firstName || ""}
            name="firstName"
            placeholder={t("user.profile.info.firstNamePlaceholder")}
          />
        </div>

        <div className="mb-3 flex flex-col gap-1">
          <Label htmlFor="lastName">
            {t("user.profile.info.lastName")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="lastName"
            name="lastName"
            defaultValue={user?.lastName || ""}
            placeholder={t("user.profile.info.lastNamePlaceholder")}
          />
        </div>

        <div className="mb-3 flex flex-col gap-1">
          <Label htmlFor="phone">
            {t("user.profile.info.phone")}{" "}
            {/* <span className="text-red-500">*</span> */}
          </Label>
          <Input
            // required
            id="phone"
            name="phone"
            defaultValue={user?.phone || ""}
            placeholder={t("user.profile.info.phonePlaceholder")}
          />
        </div>

        <div className="mb-3 flex flex-col gap-1">
          <Label htmlFor="email">{t("user.profile.info.email")}</Label>
          <Input
            required
            id="email"
            name="email"
            defaultValue={account?.email || ""}
            disabled
          />
        </div>

        <SubmitButton
          className="group-[.mobile]:mt-8 group-[.mobile]:w-full"
          defaultText={t("common.actions.save")}
          loadingText={t("common.actions.saving")}
        />
      </form>
    </div>
  );
}
