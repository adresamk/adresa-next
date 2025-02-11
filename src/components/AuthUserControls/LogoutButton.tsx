"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/server/actions/auth.actions";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LogoutButtonProps {}
export default function LogoutButton({}: LogoutButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const logoutClient = useCurrentUser((state) => state.logout);
  async function handleLogout() {
    const response = await logout();
    if (response.success) {
      // console.log("Logged out successfully!");
      toast.success(t("common.notifications.loggedOutSuccessfully"), {
        duration: 2000,
        style: {
          border: "1px solid var(--brandeis-blue)",
          backgroundColor: "var(--alice-blue)",
        },
      });
      logoutClient();
      // router.refresh();
    }
  }
  return (
    <form action={handleLogout}>
      <button>{t("header.userControls.logout")}</button>
    </form>
  );
}

// export default function LogoutButton({}: LogoutButtonProps) {
//   const t = useTranslations();
//   const router = useRouter();
//   async function handleLogout() {
//     const response = await fetch("/api/logout", {
//       method: "POST",
//     });
//     if (response.ok) {
//       console.log("Logged out successfully!");
//       router.refresh();
//     }
//   }
//   return (
//     <button onClick={handleLogout}>{t("header.userControls.logout")}</button>
//   );
// }
