"use client";
import { cn } from "@/lib/utils";
import { Bookmark, Contact, Heart, HousePlus, UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";

export default function ProfileSideMenu({ user }: { user: User | null }) {
  const pathname = usePathname();
  const t = useTranslations();
  const profileNavigation = [
    {
      label: t("user.profile.menu.profile"),
      icon: <UserIcon className="h-5 w-5" />,
      path: "/profile/info",
    },
    {
      label: t("user.profile.menu.contactInfo"),
      icon: <Contact className="h-5 w-5" />,
      path: "/profile/contact",
    },
    {
      label: t("user.profile.menu.myListings"),
      icon: <HousePlus className="h-5 w-5" />,
      path: "/profile/listings",
    },
    {
      label: t("user.profile.menu.savedSearches"),
      icon: <Bookmark className="h-5 w-5" />,
      path: "/profile/searches",
    },
    {
      label: t("user.profile.menu.likedListings"),
      icon: <Heart className="h-5 w-5" />,
      path: "/profile/liked",
    },
  ];

  if (!user) {
    return (
      <nav>
        <ul>
          <Link href={profileNavigation[0].path} prefetch>
            <li
              className={cn(
                "flex items-center gap-3 px-5 py-3",
                pathname === profileNavigation[0].path &&
                  "border-l-2 border-brand-light-blue",
              )}
            >
              {profileNavigation[0].icon} {profileNavigation[0].label}
            </li>
          </Link>
        </ul>
      </nav>
    );
  }
  return (
    <nav>
      <ul>
        {profileNavigation.map((nav) => (
          <Link key={nav.path} href={nav.path} prefetch>
            <li
              key={nav.label}
              className={cn(
                "flex items-center gap-3 px-3 py-3",

                pathname === nav.path && "border-l-2 border-brand-light-blue",
              )}
            >
              <div>{nav.icon}</div>
              <span>{nav.label}</span>
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
