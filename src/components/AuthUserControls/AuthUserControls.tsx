import { getUser } from "@/lib/auth";
import UserControls from "./UserControls";
import AuthOptionsPopup from "./AuthOptionsPopup";

export default async function AuthUserControls() {
  const user = await getUser();

  if (user) {
    return <UserControls user={user} />;
  }

  return <AuthOptionsPopup />;
}
