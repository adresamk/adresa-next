import { getUser } from "@/lib/auth";
import UserControls from "./UserControls";
import AuthOptionsPopup from "./AuthOptionsPopup";
import { getCurrentUser } from "@/lib/sessions";

export default async function AuthUserControls() {
  const { user, agency } = await getCurrentUser();

  // console.log("header", user, agency);
  if (user) {
    return <UserControls user={user} />;
  }

  if (agency) {
    return <UserControls agency={agency} />;
  }
  return <AuthOptionsPopup />;
}
