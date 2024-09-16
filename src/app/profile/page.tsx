import { getUser, validateRequest } from "@/lib/auth";

export default async function ProfilePage() {
  // const { user } = await validateRequest();
  const user = await getUser();
  return (
    <div>
      my Profile
      {user?.firstName || "Hardcoded Name Martin"}
      {user?.lastName || "Hardcoded LastName Luther"}
      {user?.picture && <img src={user.picture} alt="profile" />}
    </div>
  );
}
