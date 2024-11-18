"use client";
import { cn } from "@/lib/utils";
import { HousePlus, LayoutDashboard, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const profileNavigation = [
  {
    label: "Profile",
    icon: <User />,
    path: "/agency/profile/info",
  },
  {
    label: "Agency Profile",
    icon: <LayoutDashboard />,
    path: "/agency/profile/details",
  },
  {
    label: "Agency Listings",
    icon: <HousePlus />,
    path: "/agency/profile/listings",
  },
];
export default function ProfileSideMenu() {
  const pathname = usePathname();

  return (
    <nav>
      <ul>
        {profileNavigation.map((nav) => (
          <Link key={nav.path} href={nav.path} prefetch>
            <li
              key={nav.label}
              className={cn(
                "flex items-center gap-3 px-5 py-3",

                pathname === nav.path && "border-l-2 border-brand-light-blue",
              )}
            >
              {nav.icon} {nav.label}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
