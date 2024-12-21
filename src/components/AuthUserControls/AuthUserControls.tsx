import UserControls from "./UserControls";
import AuthOptionsPopup from "./AuthOptionsPopup";
import { getCurrentUser } from "@/lib/sessions";
import AuthButNoProfilePopup from "./AuthButNoProfilePopup";

export default async function AuthUserControls() {
  const { user, agency, isAuthenticated } = await getCurrentUser();

  // console.log("header", user, agency);
  if (user) {
    return <UserControls user={user} />;
  }

  if (agency) {
    return <UserControls agency={agency} />;
  }

  if (isAuthenticated && !user && !agency) {
    return <AuthButNoProfilePopup />;
  }

  return <AuthOptionsPopup />;
}
