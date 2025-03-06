"use client";
import { cn } from "@/lib/utils";
import { HousePlus, Info, LayoutDashboard, User, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Agency } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileSideMenu({ agency }: { agency: Agency | null }) {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
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

  const pathNameWithoutLocale = pathname.replace(`/${locale}/`, "/");
  return (
    <nav>
      {/* Mobile View */}
      <div className="sm:hidden">
        <ul>
          {/* Show current path item or first item */}
          {profileNavigation
            .filter((nav) => nav.path === pathNameWithoutLocale)
            .map((nav) => (
              <Link key={nav.path} href={nav.path} prefetch>
                <li
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-2 py-2.5 hover:bg-gray-50",
                    "border-l-2 border-brand-light-blue",
                  )}
                >
                  <div>{nav.icon}</div>
                  <span>{nav.label}</span>
                  {nav.issues && (
                    <span className="ml-auto text-red-500">
                      <Popover>
                        <PopoverTrigger>
                          <Info className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent>
                          <p className="p-2 text-xs text-red-700">
                            {t("agency.profile.menu.missingFields")}
                          </p>
                        </PopoverContent>
                      </Popover>
                    </span>
                  )}
                </li>
              </Link>
            ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-3 px-2 py-2.5 hover:bg-gray-50">
              <Menu className="h-4 w-4" />
              <span>{t("agency.profile.menu.label")}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {profileNavigation
                .filter((nav) => nav.path !== pathname)
                .map((nav) => (
                  <DropdownMenuItem key={nav.path} asChild>
                    <Link
                      href={nav.path}
                      prefetch
                      className="flex w-[calc(100vw-24px)] cursor-pointer items-center gap-3 px-2 py-2.5 hover:bg-gray-50"
                    >
                      <div>{nav.icon}</div>
                      <span className="text-base">{nav.label}</span>
                      {nav.issues && (
                        <Info className="ml-2 h-4 w-4 text-red-500" />
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </ul>
      </div>

      {/* Desktop View */}
      <ul className="hidden sm:block">
        {profileNavigation.map((nav) => (
          <Link key={nav.path} href={nav.path} prefetch className="">
            <li
              key={nav.label}
              className={cn(
                "flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 sm:gap-3 sm:px-5 sm:py-3",
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
