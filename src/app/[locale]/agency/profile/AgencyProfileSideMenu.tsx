"use client";
import { cn } from "@/lib/utils";
import { HousePlus, LayoutDashboard, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function ProfileSideMenu() {
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
