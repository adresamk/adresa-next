"use client";
import { cn } from "@/lib/utils";
import { Bookmark, Heart, HousePlus, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";

const profileNavigation = [
  {
    label: "Profile",
    icon: <User />,
    path: "/profile/info",
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
