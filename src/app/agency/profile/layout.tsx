import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import AgencyProfileSideMenu from "./AgencyProfileSideMenu";

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
    <main className=" flex max-w-[1200px] mx-auto px-6 ">
      <div className=" min-w-[220px] bg-white shadow min-h-screen">
        <div className="px-3 py-6">
          <p>Welcome</p>
          <p className="text-xl">
            {user.firstName} {user.lastName}
          </p>
        </div>
        <AgencyProfileSideMenu />
      </div>
      <div className="w-full">{children}</div>
    </main>
  );
}
