"use client";
import { cn } from "@/lib/utils";
import { Bookmark, Heart, HousePlus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const profileNavigation = [
  {
    label: "Profile",
    icon: <User />,
    path: "/profile/contact",
  },
  {
    label: "My Listings",
    icon: <HousePlus />,
    path: "/profile/listings",
  },
  {
    label: "Saved Searches",
    icon: <Bookmark />,
    path: "/profile/searches",
  },
  {
    label: "Liked Listings",
    icon: <Heart />,
    path: "/profile/liked",
  },
];
export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <main className=" flex max-w-[1100px] mx-auto px-6 ">
      <div className=" min-w-[220px] bg-white shadow min-h-screen">
        <div className="px-3 py-6">
          <p>Welcome</p>
          <p className="text-xl">Martin Martinovski</p>
        </div>
        <nav>
          <ul>
            {profileNavigation.map((nav) => (
              <Link href={nav.path} prefetch>
                <li
                  key={nav.label}
                  className={cn(
                    "flex gap-3 items-center px-5 py-3",

                    pathname === nav.path &&
                      "border-l-2 border-brand-dark-blue"
                  )}
                >
                  {nav.icon} {nav.label}
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </div>
      <div className="w-full">{children}</div>
    </main>
  );
}
