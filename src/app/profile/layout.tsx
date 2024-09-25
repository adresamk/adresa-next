import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileSideMenu from "./ProfileSideMenu";

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/signin");
  }

  return (
    <main className=" flex max-w-[1100px] mx-auto px-6 ">
      <div className=" min-w-[220px] bg-white shadow min-h-screen">
        <div className="px-3 py-6">
          <p>Welcome</p>
          <p className="text-xl">
            {user.firstName} {user.lastName}
          </p>
        </div>
        <ProfileSideMenu />
      </div>
      <div className="w-full">{children}</div>
    </main>
  );
}
