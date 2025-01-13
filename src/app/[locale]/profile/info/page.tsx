import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUser } from "@/lib/auth";
import { getCurrentUser } from "@/lib/sessions";
import { updateUserInfo } from "@/server/actions/user.actions";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

type Params = Promise<Record<string, string>>;

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
    <div className="ml-4 mt-4 rounded-lg bg-white p-8 shadow">
      <h3 className="mb-3 text-2xl font-semibold">
        {t("user.profile.info.title")}
      </h3>
      <form
        className="py-2"
        action={async (formData: FormData) => {
          "use server";
          const result = await updateUserInfo(formData);
          if (result?.success) {
            revalidatePath("/profile/info");
          }
        }}
      >
        <div className="mb-2 flex flex-col gap-3">
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

        <div className="mb-2 flex flex-col gap-3">
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

        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="phone">
            {t("user.profile.info.phone")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            id="phone"
            name="phone"
            defaultValue={user?.phone || ""}
            placeholder={t("user.profile.info.phonePlaceholder")}
          />
        </div>

        <div className="mb-2 flex flex-col gap-3">
          <Label htmlFor="email">{t("user.profile.info.email")}</Label>
          <Input
            required
            id="email"
            name="email"
            defaultValue={account?.email || ""}
            disabled
          />
        </div>

        <Button>{t("common.actions.save")}</Button>
      </form>
    </div>
  );
}
