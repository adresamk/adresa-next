"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/server/actions/auth.actions";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface LogoutButtonProps {}
export default function LogoutButton({}: LogoutButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const logoutClient = useCurrentUser((state) => state.logout);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    try {
      setIsLoading(true);
      const response = await logout();
      if (response?.success) {
        toast.success(t("common.notifications.loggedOutSuccessfully"), {
          duration: 2000,
          style: {
            border: "1px solid var(--brandeis-blue)",
            backgroundColor: "var(--alice-blue)",
          },
        });
        logoutClient();

        // router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(t("Error with logging out"), {
        duration: 2000,
        style: {
          border: "1px solid var(--brandeis-blue)",
          backgroundColor: "var(--alice-blue)",
        },
      });
    } finally {
      setIsLoading(false);
    }
  }
  // const [response, logoutAction] = useFormState(logout, undefined);
  //effect description
  // useEffect(() => {
  //   if (response?.success) {
  //     logoutClient();
  //     toast.success(t("common.notifications.loggedOutSuccessfully"), {
  //       duration: 2000,
  //       style: {
  //         border: "1px solid var(--brandeis-blue)",
  //         backgroundColor: "var(--alice-blue)",
  //       },
  //     });
  //     router.push("/");
  //   }
  // }, [response]);

  return (
    <Button variant={"ghost"} onClick={handleLogout} className="w-full">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        t("header.userControls.logout")
      )}
    </Button>
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
