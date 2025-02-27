"use client";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Contact,
  Heart,
  HousePlus,
  Info,
  UserIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ProfileSideMenu({ user }: { user: User | null }) {
  const pathname = usePathname();
  const t = useTranslations();
  const profileNavigation = [
    {
      label: t("user.profile.menu.profile"),
      icon: <UserIcon className="h-5 w-5" />,
      path: "/profile/info",
      issues: !user?.firstName || !user?.lastName,
    },
    {
      label: t("user.profile.menu.contactInfo"),
      icon: <Contact className="h-5 w-5" />,
      path: "/profile/contact",
      issues: !user?.contactName || !user?.contactPhone || !user?.contactEmail,
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
              {nav.issues && (
                <span className="ml-auto text-red-500">
                  <Popover defaultOpen={true}>
                    <PopoverTrigger>
                      <Info className="h-4 w-4" />
                    </PopoverTrigger>
                    <PopoverContent>
                      <p className="p-2 text-xs text-red-700">Missing fields</p>
                    </PopoverContent>
                  </Popover>
                </span>
              )}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
