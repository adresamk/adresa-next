import { getUser, validateRequest } from "@/lib/auth";

export default async function ProfilePage() {
  // const { user } = await validateRequest();
  const user = await getUser();
  return (
    <div>
      my Profile
      {user?.name || "Martin Martinovski"}
      {user?.picture && <img src={user.picture} alt="profile" />}
    </div>
  );
}
