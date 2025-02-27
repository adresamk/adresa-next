"use client";
import { cn } from "@/lib/utils";
import { HousePlus, Info, LayoutDashboard, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Agency } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ProfileSideMenu({ agency }: { agency: Agency | null }) {
  const pathname = usePathname();
  const t = useTranslations();

  const missingDetails = !agency?.name || !agency?.slug || !agency?.logo;
  const missingInfo =
    !agency?.ownerFirstName || !agency?.ownerLastName || !agency?.ownerEmail;

  const profileNavigation = [
    {
      label: t("agency.profile.menu.info"),
      icon: <User className="h-4 w-4" />,
      path: "/agency/profile/info",
      issues: missingInfo,
    },
    {
      label: t("agency.profile.menu.details"),
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: "/agency/profile/details",
      issues: missingDetails,
    },
    {
      label: t("agency.profile.menu.listings"),
      icon: <HousePlus className="h-4 w-4" />,
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
