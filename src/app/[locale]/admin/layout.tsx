import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Home, Building2, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/sessions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, account } = await getCurrentUser();

  if (!account || account.role !== "ADMIN") {
    redirect("/");
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutGrid },
    { name: "Listings", href: "/admin/listings", icon: Building2 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6" />
              <span className="text-lg font-semibold">Adresa Admin</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-brand-light-blue",
                        )}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <main className="pl-72">
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
