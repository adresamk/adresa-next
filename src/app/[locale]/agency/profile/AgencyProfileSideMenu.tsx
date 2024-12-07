"use client";
import { cn } from "@/lib/utils";
import { HousePlus, LayoutDashboard, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Agency } from "@prisma/client";

export default function ProfileSideMenu({ agency }: { agency: Agency | null }) {
  const pathname = usePathname();
  const t = useTranslations();

  const profileNavigation = [
    {
      label: t("agency.profile.menu.info"),
      icon: <User />,
      path: "/agency/profile/info",
    },
    {
      label: t("agency.profile.menu.details"),
      icon: <LayoutDashboard />,
      path: "/agency/profile/details",
    },
    {
      label: t("agency.profile.menu.listings"),
      icon: <HousePlus />,
      path: "/agency/profile/listings",
    },
  ];
  if (!agency) {
    return (
      <nav>
        <ul>
          <Link href={profileNavigation[1].path} prefetch>
            <li
              className={cn(
                "flex items-center gap-3 px-5 py-3",
                pathname === profileNavigation[1].path &&
                  "border-l-2 border-brand-light-blue",
              )}
            >
              {profileNavigation[1].icon} {profileNavigation[1].label}
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
