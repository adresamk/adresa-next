import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import AgencyProfileSideMenu from "./AgencyProfileSideMenu";

type Params = Promise<{ children: React.ReactNode }>;

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const layoutParams = await params;
  const { user } = await validateRequest();
  if (!user) {
    redirect("/signin");
  }

  return (
    <main className="mx-auto flex max-w-[1200px] px-6">
      <div className="min-h-screen min-w-[220px] bg-white shadow">
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
